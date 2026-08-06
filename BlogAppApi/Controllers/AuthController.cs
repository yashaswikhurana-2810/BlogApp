using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR.Protocol;

namespace BlogAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(ApplicationDbContext context, IJwtService jwtService) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if(await context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("Email already exists.");
            }
            User user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
            return Ok("Registration Successful");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            User user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (user == null)
            {
                return BadRequest("Please Register First");
            }

            var Id = user.Id;

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest("Email or Password is Wrong");
            }
            var token = jwtService.GenerateToken(user);
            return Ok(new {Message = "Login Successful",
                    Token = token,
                   Id
            });
        }


    }
}
