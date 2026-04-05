using Microsoft.EntityFrameworkCore;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.DataAccessLayer.Context;

public class PlatformDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<GroupEntity> Groups { get; set; }
    public DbSet<SubjectEntity> Subjects { get; set; }
    public DbSet<GradeEntity> Grades { get; set; }
    public DbSet<AttendanceEntity> Attendances { get; set; }
    public DbSet<ReportEntity> Reports { get; set; }
    public DbSet<EventEntity> Events { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=studyplatform;Username=postgres;Password=postgres;");
        }
    }
}