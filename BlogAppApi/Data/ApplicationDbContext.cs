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

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users  => Set<User>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<Category> Categories => Set<Category>();
    }
}
