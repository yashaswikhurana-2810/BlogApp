using Microsoft.AspNetCore.Mvc;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace BlogAppApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            var result = await categoryService.CreateCategoryAsync(dto);

            if (!result)
            {
                return BadRequest("Category already exists.");
            }

            return Ok("Category created successfully.");
        }

        [HttpGet]
        public async Task<List<Category>> GetCategories()
        {
            List<Category> result = await  categoryService.GetAllCategoriesAsync();

            return result;
        }
        [HttpDelete("{categoryId}")]
        public async Task<IActionResult> DeleteCategory(Guid categoryId)
        {
            var result = await categoryService.DeleteCategoryAsync(categoryId);

            if (!result)
            {
                return NotFound("Category not found.");
            }

            return Ok("Category deleted successfully.");
        }

    }
}
