using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace BlogAppApi.DTOs
{
    public class CreateBlogDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public Guid CategoryId { get; set; }
    }
}
