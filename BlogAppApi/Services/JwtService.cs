using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogAppApi.Services;

public class JwtService : IJwtService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public JwtService(IHttpClientFactory httpClientFactory, ApplicationDbContext context, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> GenerateTokenAsync(User user, CancellationToken cancellationToken = default)
    {
        var response = await Client.PostAsJsonAsync("Auth/token", new TokenRequestDto
        {
            ClientId = RequiredSetting("AUTH_CLIENT_ID"),
            ClientSecret = RequiredSetting("AUTH_CLIENT_SECRET"),
            Email = user.Email
        }, cancellationToken);

        var token = await ReadTokenResponseAsync(response, cancellationToken);
        _context.UserAuthTokens.Add(new UserAuthToken
        {
            UserId = user.Id,
            AccessTokenHash = Hash(token.AccessToken),
            RefreshTokenHash = Hash(token.RefreshToken),
            ExpiresAt = DateTime.UtcNow.AddSeconds(token.ExpiresIn)
        });
        await _context.SaveChangesAsync(cancellationToken);
        return token;
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto refreshToken, CancellationToken cancellationToken = default)
    {
        var session = await _context.UserAuthTokens.SingleOrDefaultAsync(
            x => x.RefreshTokenHash == Hash(refreshToken.RefreshToken), cancellationToken);
        if (session is null)
            throw new UnauthorizedAccessException("Refresh token is not associated with a BlogApp user.");

        var response = await Client.PostAsJsonAsync("Auth/refresh", refreshToken, cancellationToken);
        var token = await ReadTokenResponseAsync(response, cancellationToken);
        session.AccessTokenHash = Hash(token.AccessToken);
        session.RefreshTokenHash = Hash(token.RefreshToken);
        session.ExpiresAt = DateTime.UtcNow.AddSeconds(token.ExpiresIn);
        await _context.SaveChangesAsync(cancellationToken);
        return token;
    }

    public async Task<bool> ValidateTokenAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        var response = await Client.PostAsJsonAsync("Auth/validate", accessToken, cancellationToken);
        return response.IsSuccessStatusCode;
    }

    public async Task RevokeTokenAsync(string accessToken, CancellationToken cancellationToken = default)
    {
        var response = await Client.PostAsJsonAsync("Auth/revoke", accessToken, cancellationToken);
        if (!response.IsSuccessStatusCode)
            throw new UnauthorizedAccessException("The access token could not be revoked.");

        var session = await _context.UserAuthTokens.SingleOrDefaultAsync(
            x => x.AccessTokenHash == Hash(accessToken), cancellationToken);
        if (session is not null)
        {
            _context.UserAuthTokens.Remove(session);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public Task<Guid?> GetUserIdAsync(string accessToken, CancellationToken cancellationToken = default) =>
        _context.UserAuthTokens.Where(x => x.AccessTokenHash == Hash(accessToken))
            .Select(x => (Guid?)x.UserId).SingleOrDefaultAsync(cancellationToken);

    private HttpClient Client => _httpClientFactory.CreateClient("IdentityHub");

    private string RequiredSetting(string key) => _configuration[key]
        ?? throw new InvalidOperationException($"Missing required configuration value '{key}'.");

    private static async Task<AuthResponseDto> ReadTokenResponseAsync(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        if (!response.IsSuccessStatusCode)
            throw new UnauthorizedAccessException("Identity Hub rejected the token request.");

        return await response.Content.ReadFromJsonAsync<AuthResponseDto>(cancellationToken: cancellationToken)
            ?? throw new InvalidOperationException("Identity Hub returned an empty token response.");
    }

    private static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
