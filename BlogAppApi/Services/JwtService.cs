using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using Microsoft.Extensions.Caching.Memory;

namespace BlogAppApi.Services;

public class JwtService : IJwtService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;

    public JwtService(IHttpClientFactory httpClientFactory, IMemoryCache cache, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> GenerateTokenAsync(User user)
    {
        var response = await Client.PostAsJsonAsync("Auth/token", new TokenRequestDto
        {
            ClientId = RequiredSetting("AUTH_CLIENT_ID"),
            ClientSecret = RequiredSetting("AUTH_CLIENT_SECRET"),
            Email = user.Email
        });

        var token = await ReadTokenResponseAsync(response);
        StoreSession(token, user.Id);
        return token;
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto refreshToken)
    {
        if (!_cache.TryGetValue<Guid>(RefreshKey(refreshToken.RefreshToken), out var userId))
            throw new UnauthorizedAccessException("Refresh token is not associated with this BlogApp session.");

        var response = await Client.PostAsJsonAsync("Auth/refresh", refreshToken);
        var token = await ReadTokenResponseAsync(response);
        _cache.Remove(RefreshKey(refreshToken.RefreshToken));
        StoreSession(token, userId);
        return token;
    }

    public async Task<bool> ValidateTokenAsync(string accessToken)
    {
        var response = await Client.PostAsJsonAsync("Auth/validate", accessToken);
        return response.IsSuccessStatusCode;
    }

    public async Task RevokeTokenAsync(string accessToken)
    {
        var response = await Client.PostAsJsonAsync("Auth/revoke", accessToken);
        if (!response.IsSuccessStatusCode)
            throw new UnauthorizedAccessException("The access token could not be revoked.");

        _cache.Remove(AccessKey(accessToken));
    }

    public Task<Guid?> GetUserIdAsync(string accessToken) =>
        Task.FromResult(_cache.TryGetValue<Guid>(AccessKey(accessToken), out var userId)
            ? (Guid?)userId
            : null);

    private void StoreSession(AuthResponseDto token, Guid userId)
    {
        _cache.Set(AccessKey(token.AccessToken), userId, TimeSpan.FromSeconds(token.ExpiresIn));
        _cache.Set(RefreshKey(token.RefreshToken), userId, TimeSpan.FromDays(30));
    }

    private HttpClient Client => _httpClientFactory.CreateClient("IdentityHub");

    private string RequiredSetting(string key) => _configuration[key]
        ?? throw new InvalidOperationException($"Missing required configuration value '{key}'.");

    private static async Task<AuthResponseDto> ReadTokenResponseAsync(HttpResponseMessage response)
    {
        if (!response.IsSuccessStatusCode)
            throw new UnauthorizedAccessException("Identity Hub rejected the token request.");

        return await response.Content.ReadFromJsonAsync<AuthResponseDto>()
            ?? throw new InvalidOperationException("Identity Hub returned an empty token response.");
    }

    private static string AccessKey(string token) => "access:" + Hash(token);
    private static string RefreshKey(string token) => "refresh:" + Hash(token);
    private static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
