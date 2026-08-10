using BlogAppApi.Data;
using BlogAppApi.Services;
using BlogAppApi.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();


var cs = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(cs));

builder.Services.AddControllers();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddHttpClient("IdentityHub", client =>
{
    var authUrl = builder.Configuration["AUTH_URL"]
        ?? throw new InvalidOperationException("Missing required configuration value 'AUTH_URL'.");
    client.BaseAddress = new Uri(authUrl.TrimEnd('/') + "/");
});
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy
            .WithOrigins("*")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication("IdentityHub")
    .AddScheme<AuthenticationSchemeOptions, IdentityHubAuthenticationHandler>("IdentityHub", null);
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("ReactFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
