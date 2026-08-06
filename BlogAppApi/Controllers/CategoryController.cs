using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.AspNetCore.Authorization;

namespace BlogAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService; 

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
        {
            var result = await _categoryService.CreateCategoryAsync(dto);

            if (!result)
            {
                return BadRequest("Category already exists.");
            }

            return Ok("Category created successfully.");
        }

        [Authorize]
        [HttpGet]
        public async Task<List<Category>> GetCategories()
        {
            List<Category> result = await  _categoryService.GetAllCategoriesAsync();

            return result;
        }


    }
}
