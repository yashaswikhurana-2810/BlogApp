using BlogAppApi.DTOs;
using BlogAppApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BlogAppApi.Services
{
    public interface IJwtService
    {
        String GenerateToken(TokenRequestDto user);
        bool ValidateToken(string accessToken);
        String GetRefreshToken(RefreshTokenDto refreshToken);
        bool RevokeToken(string accessToken);
    }
}
