using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace BlogAppApi.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var projectDirectory = Directory.GetCurrentDirectory();
        var envFile = Path.Combine(projectDirectory, ".env");
        if (!File.Exists(envFile))
            envFile = Path.Combine(projectDirectory, "BlogAppApi", ".env");

        DotNetEnv.Env.Load(envFile);
        var configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionStrings__DefaultConnection is not configured.");

        return new ApplicationDbContext(new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(connectionString)
            .Options);
    }
}
