using BlogAppApi.DTOs;
using BlogAppApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BlogAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class BlogPostsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogPostsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        // GET: api/blogposts
        [HttpGet]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _blogService.GetAllBlogsAsync();

            return Ok(blogs);
        }

        // GET: api/blogposts/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBlogById(Guid id)
        {
            var blog = await _blogService.GetBlogByIdAsync(id);

            if (blog == null)
                return NotFound("Blog not found.");

            return Ok(blog);
        }

        // POST: api/blogposts
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateBlog(CreateBlogDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _blogService.CreateBlogAsync(dto, userId);

            if (!result)
                return BadRequest("Unable to create blog.");

            return Ok("Blog created successfully.");
        }

        // PUT: api/blogposts/{id}
        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateBlog(Guid id, UpdateBlogDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _blogService.UpdateBlogAsync(id, dto, userId);

            if (!result)
                return NotFound("Blog not found or you are not authorized.");

            return Ok("Blog updated successfully.");
        }

        // DELETE: api/blogposts/{id}
        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteBlog(Guid id)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _blogService.DeleteBlogAsync(id, userId);

            if (!result)
                return NotFound("Blog not found or you are not authorized.");

            return Ok("Blog deleted successfully.");
        }
    }
}
