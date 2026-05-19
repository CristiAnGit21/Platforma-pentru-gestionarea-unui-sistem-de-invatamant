using Microsoft.EntityFrameworkCore;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.DataAccessLayer;

namespace StudyPlatform.DataAccessLayer.Context;

public class PlatformDbContext : DbContext
{
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<SessionEntity> Sessions { get; set; }
    public DbSet<GroupEntity> Groups { get; set; }
    public DbSet<SubjectEntity> Subjects { get; set; }
    public DbSet<GradeEntity> Grades { get; set; }
    public DbSet<AttendanceEntity> Attendances { get; set; }
    public DbSet<ReportEntity> Reports { get; set; }
    public DbSet<EventEntity> Events { get; set; }
    public DbSet<NotificationEntity> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User → Group optional many-to-one
        modelBuilder.Entity<UserEntity>()
            .HasOne<GroupEntity>()
            .WithMany()
            .HasForeignKey(u => u.GroupId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        // Grade → Student (User) many-to-one
        modelBuilder.Entity<GradeEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Grade → Subject many-to-one
        modelBuilder.Entity<GradeEntity>()
            .HasOne<SubjectEntity>()
            .WithMany()
            .HasForeignKey(g => g.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Attendance → Student (User) many-to-one
        modelBuilder.Entity<AttendanceEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Attendance → Subject many-to-one
        modelBuilder.Entity<AttendanceEntity>()
            .HasOne<SubjectEntity>()
            .WithMany()
            .HasForeignKey(a => a.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Report → User optional many-to-one
        modelBuilder.Entity<ReportEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        // Event → Professor (User) optional many-to-one
        modelBuilder.Entity<EventEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(e => e.ProfessorId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var cs = string.IsNullOrEmpty(DbSession.ConnectionString)
                ? "Host=localhost;Port=5432;Database=studyplatform;Username=postgres;Password=postgres;"
                : DbSession.ConnectionString;
            optionsBuilder.UseNpgsql(cs);
        }
    }
}