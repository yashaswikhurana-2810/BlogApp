using BlogAppApi.DTOs;
using BlogAppApi.Models;

namespace BlogAppApi.Services;

public interface IJwtService
{
    Task<AuthResponseDto> GenerateTokenAsync(User user);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto refreshToken);
    Task<bool> ValidateTokenAsync(string accessToken);
    Task RevokeTokenAsync(string accessToken);
    Task<Guid?> GetUserIdAsync(string accessToken);
}
