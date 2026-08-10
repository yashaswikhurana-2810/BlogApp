using BlogAppApi.DTOs;
using BlogAppApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BlogAppApi.Services
{
    public interface IJwtService
    {
        String GenerateToken(UserDto user);
        IActionResult ValidateToken(string accessToken);
        String GetRefreshToken(RefreshTokenDto refreshToken);
        IActionResult RevokeToken(string accessToken);
    }
}
