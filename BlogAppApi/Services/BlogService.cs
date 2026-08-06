using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http.HttpResults;

namespace BlogAppApi.Services
{
    public class BlogService:IBlogService
    {
        private readonly ApplicationDbContext _context;

        public BlogService(ApplicationDbContext context)
        {
            _context = context;
        }
      
       public async Task<IEnumerable<BlogDto>> GetAllBlogsAsync()
        {
            var Blogs = await _context.BlogPosts
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    ImageUrl = b.ImageUrl,
                    IsPublished = b.IsPublished,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    AuthorName = b.User.Name,
                    CategoryName = b.Category.Name
                })
                .ToListAsync();

            return Blogs;

        }

        public async Task<BlogDto?> GetBlogByIdAsync(Guid id)
        {
            var Blog = await _context.BlogPosts
                .Include(b => b.User)
                .Include(b => b.Category)
                .Where(b => b.Id ==id)
                .Select(b => new BlogDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    ImageUrl = b.ImageUrl,
                    IsPublished = b.IsPublished,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    AuthorName = b.User.Name,
                    CategoryName = b.Category.Name
                })
                .FirstOrDefaultAsync();

            return Blog;

        }

        public async Task<bool> CreateBlogAsync(CreateBlogDto dto,Guid userId)
        {
            var blog = new BlogPost
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Content = dto.Content,
                ImageUrl = dto.ImageUrl,
                IsPublished = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = null,
                UserId = userId,
                CategoryId = dto.CategoryId,

            };

            await _context.BlogPosts.AddAsync(blog);

            await _context.SaveChangesAsync();

            return true;

        }
        public async Task<bool> UpdateBlogAsync(Guid id,UpdateBlogDto dto,Guid userId)
        {
            var blog = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
                return false;

            if (blog.UserId != userId)
                return false;

            blog.Title = dto.Title;
            blog.Content = dto.Content;
            blog.ImageUrl = dto.ImageUrl;
            blog.CategoryId = dto.CategoryId;
            blog.IsPublished = dto.IsPublished;
            blog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;

        }
        public async Task<bool> DeleteBlogAsync(Guid userId,Guid id)
        {
            var blog = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
                return false;

            if (blog.UserId != userId)
                return false;

            _context.BlogPosts.Remove(blog);

            await _context.SaveChangesAsync();

            return true;

        }

    }
}
