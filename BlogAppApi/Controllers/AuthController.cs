using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogAppApi.Data;
using BlogAppApi.DTOs;
using BlogAppApi.Models;
using BlogAppApi.Services;

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
            User? user = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            if (user == null)
            {
                return BadRequest("Please Register First");
            }

            var Id = user.Id;

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            {
                return BadRequest("Email or Password is Wrong");
            }
            AuthResponseDto token;
            try
            {
                token = await jwtService.GenerateTokenAsync(user, HttpContext.RequestAborted);
            }
            catch (HttpRequestException)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, "Authentication service is unavailable.");
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(StatusCodes.Status502BadGateway, "Authentication service rejected the BlogApp client credentials.");
            }

            return Ok(new {Message = "Login Successful",
                    Token = token.AccessToken,
                    RefreshToken = token.RefreshToken,
                    ExpiresIn = token.ExpiresIn,
                   Id
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenDto dto)
        {
            try
            {
                var token = await jwtService.RefreshTokenAsync(dto, HttpContext.RequestAborted);
                return Ok(new { Token = token.AccessToken, RefreshToken = token.RefreshToken, ExpiresIn = token.ExpiresIn });
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Invalid refresh token.");
            }
            catch (HttpRequestException)
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable, "Authentication service is unavailable.");
            }
        }


    }
}
