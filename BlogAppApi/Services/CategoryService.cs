using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace BlogAppApi.Services
{
    public class CategoryService(ApplicationDbContext context):ICategoryService
    {
        public async Task<bool> CreateCategoryAsync(CreateCategoryDto dto)
        {
            if (await context.Categories.AnyAsync(c => c.Name == dto.Name))
            {
                return false;
            }

            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = dto.Name
            };

            await context.Categories.AddAsync(category);

            await context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await context.Categories.ToListAsync();
        }
    }
}
