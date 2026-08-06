using BlogAppApi.DTOs;
using BlogAppApi.Models;
namespace BlogAppApi.Services
{
    public interface ICategoryService
    {
        Task<bool> CreateCategoryAsync(CreateCategoryDto dto);
        Task<List<Category>> GetAllCategoriesAsync();
    }
}
