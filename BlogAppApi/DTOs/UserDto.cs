using System.ComponentModel.DataAnnotations;

namespace BlogAppApi.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
