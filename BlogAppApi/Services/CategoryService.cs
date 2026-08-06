using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace BlogAppApi.Services
{
    public class CategoryService:ICategoryService
    {
        private readonly ApplicationDbContext _context; 

        public CategoryService( ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<bool> CreateCategoryAsync(CreateCategoryDto dto)
        {
            if (await _context.Categories.AnyAsync(c => c.Name == dto.Name))
            {
                return false;
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

            await _context.Categories.AddAsync(category);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
