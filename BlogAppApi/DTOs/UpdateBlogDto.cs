using System.ComponentModel.DataAnnotations;

namespace BlogAppApi.DTOs
{
    public class UpdateBlogDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public bool IsPublished { get; set; }

        public Guid CategoryId { get; set; }
    }
}
