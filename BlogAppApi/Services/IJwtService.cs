using BlogAppApi.Models;

namespace BlogAppApi.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
