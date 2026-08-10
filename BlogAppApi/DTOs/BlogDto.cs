using BlogAppApi.Models;
using System.ComponentModel.DataAnnotations;
namespace BlogAppApi.DTOs
{
    public class BlogDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }

    }
}
