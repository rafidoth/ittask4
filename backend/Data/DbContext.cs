using ittask4.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ittask4.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected ApplicationDbContext()
        {

        }

        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>().HasIndex(e => e.Email).IsUnique();
            modelBuilder.Entity<User>().Property(e => e.CreatedAt).HasDefaultValueSql("now()");
            modelBuilder.Entity<User>().Property(e => e.Status).HasDefaultValueSql(((int)UserStatus.Unverified).ToString());
            modelBuilder.Entity<User>().Property(e => e.ActivitesInMinutes).HasColumnType("jsonb");
        }
    }
}
