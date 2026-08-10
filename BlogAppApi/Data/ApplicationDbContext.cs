using Microsoft.EntityFrameworkCore;
using BlogAppApi.Models;
using Microsoft.AspNetCore.Mvc;
using BlogAppApi.DTOs;



namespace BlogAppApi.Data

{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasQueryFilter(u => !u.IsSoftDeleted);
            modelBuilder.Entity<BlogPost>()
                .HasQueryFilter(b => !b.IsDeleted);
            modelBuilder.Entity<UserAuthToken>()
                .HasIndex(t => t.AccessTokenHash)
                .IsUnique();
            modelBuilder.Entity<UserAuthToken>()
                .HasIndex(t => t.RefreshTokenHash)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users  => Set<User>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<UserAuthToken> UserAuthTokens => Set<UserAuthToken>();
    }
}
