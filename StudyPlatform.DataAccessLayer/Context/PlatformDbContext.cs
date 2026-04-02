using Microsoft.EntityFrameworkCore;
using StudyPlatform.Domain.Entities.Admin;
using StudyPlatform.Domain.Entities.Student;

namespace StudyPlatform.DataAccessLayer.Context;

public class PlatformDbContext: DbContext
{
    public DbSet<StudentEntity> Students { get; set; }
    // public DbSet<CategoryEntity> Categories { get; set; }
    // public DbSet<StudentCategoryEntity> StudentCategories { get; set; }
    
    public DbSet<AdminInfoDto> Admins { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=studyplatform;Username=postgres;Password=postgres;");
        }
    }
    
}
