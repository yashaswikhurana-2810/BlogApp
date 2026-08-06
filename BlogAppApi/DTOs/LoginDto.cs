using System.ComponentModel.DataAnnotations;

namespace BlogAppApi.DTOs
{
    public class LoginDto
    {

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
