using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Project5.Areas.Identity.Data;
using Project5.Models;

namespace Project5.Data;

public class Project5Context : IdentityDbContext<Project5User>
{
    public Project5Context(DbContextOptions<Project5Context> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }

    public DbSet<Project5.Models.Catalog> Catalog { get; set; } = default!;

    public DbSet<Project5.Models.Course> Course { get; set; } = default!;

    public DbSet<Project5.Models.HasCourse> HasCourse { get; set; } = default!;

    public DbSet<Project5.Models.MajorMinor> MajorMinor { get; set; } = default!;

    public DbSet<Project5.Models.Plan> Plan { get; set; } = default!;

    public DbSet<Project5.Models.Requirement> Requirement { get; set; } = default!;

    public DbSet<Project5.Models.User> User { get; set; } = default!;
}
