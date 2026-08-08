using BlogAppApi.DTOs;

namespace BlogAppApi.Services
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogDto>> GetAllBlogsAsync();

        Task<IEnumerable<BlogDto>> GetBlogsByUserAsync(Guid userId);

        Task<BlogDto?> GetBlogByIdAsync(Guid id);

        Task<bool> CreateBlogAsync(CreateBlogDto dto, Guid userId);

        Task<bool> UpdateBlogAsync(Guid id, UpdateBlogDto dto, Guid userId);

        Task<bool> DeleteBlogAsync(Guid id, Guid userId);
    }
}
