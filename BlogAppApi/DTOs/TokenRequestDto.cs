using System.ComponentModel.DataAnnotations;

namespace BlogAppApi.DTOs
{
    public class TokenRequestDto
    {
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
