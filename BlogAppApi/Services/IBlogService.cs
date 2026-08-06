using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Services;
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
