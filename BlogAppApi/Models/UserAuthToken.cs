using System.ComponentModel.DataAnnotations;

namespace BlogAppApi.Models;

public class UserAuthToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    [Required, MaxLength(64)]
    public string AccessTokenHash { get; set; } = string.Empty;

    [Required, MaxLength(64)]
    public string RefreshTokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
    public User User { get; set; } = null!;
}
