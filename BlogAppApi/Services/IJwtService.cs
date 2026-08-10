using BlogAppApi.DTOs;
using BlogAppApi.Models;

namespace BlogAppApi.Services;

public interface IJwtService
{
    Task<AuthResponseDto> GenerateTokenAsync(User user, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto refreshToken, CancellationToken cancellationToken = default);
    Task<bool> ValidateTokenAsync(string accessToken, CancellationToken cancellationToken = default);
    Task RevokeTokenAsync(string accessToken, CancellationToken cancellationToken = default);
    Task<Guid?> GetUserIdAsync(string accessToken, CancellationToken cancellationToken = default);
}
