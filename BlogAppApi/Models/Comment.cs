using System.ComponentModel.DataAnnotations;


namespace BlogAppApi.Models
{
    public class Comment
    {
        public Guid Id { get; set; }
        [Required]
        [MaxLength(500)]
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid BlogPostId { get; set; }
        public BlogPost BlogPost { get; set; }
    }
}
