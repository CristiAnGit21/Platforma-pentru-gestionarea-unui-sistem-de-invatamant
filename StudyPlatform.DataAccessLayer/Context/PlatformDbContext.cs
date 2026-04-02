using Microsoft.EntityFrameworkCore;
using StudyPlatform.Domain.Entities.Enums; 

namespace StudyPlatform.DataAccessLayer.Context;

public class PlatformDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Păstrează parola ta de la postgres dacă este diferită de "postgres"
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=studyplatform;Username=postgres;Password=postgres;");
        }
    }
}