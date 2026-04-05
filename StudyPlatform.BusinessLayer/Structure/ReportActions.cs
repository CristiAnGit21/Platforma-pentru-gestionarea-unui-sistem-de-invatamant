using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Domain.Models.Report;

namespace StudyPlatform.BusinessLayer.Structure;

public class ReportActions
{
    public bool CreateReport(ReportCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var report = new ReportEntity
            {
                Category = dto.Category,
                Subject = dto.Subject.Trim(),
                Description = dto.Description.Trim(),
                Priority = dto.Priority,
                Status = ReportStatus.Trimis,
                Anonymous = dto.Anonymous,
                UserId = dto.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            context.Reports.Add(report);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare raport: {ex.Message}"); return false; }
    }

    public bool UpdateReport(Guid id, ReportInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var report = context.Reports.FirstOrDefault(x => x.Id == id);
            if (report is null) return false;
            report.Category = dto.Category;
            report.Subject = dto.Subject.Trim();
            report.Description = dto.Description.Trim();
            report.Priority = dto.Priority;
            report.Status = dto.Status;
            report.Anonymous = dto.Anonymous;
            report.UpdatedAt = DateTime.UtcNow;
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update raport: {ex.Message}"); return false; }
    }

    public bool DeleteReport(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var report = context.Reports.FirstOrDefault(x => x.Id == id);
            if (report is null) return false;
            context.Reports.Remove(report);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere raport: {ex.Message}"); return false; }
    }

    public ReportInfoDto? GetReportById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var r = context.Reports.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (r is null) return null;
            return MapToDto(r);
        }
        catch { return null; }
    }

    public List<ReportInfoDto> GetReportList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Reports.AsNoTracking().Select(r => MapToDto(r)).ToList();
        }
        catch { return new List<ReportInfoDto>(); }
    }

    private static ReportInfoDto MapToDto(ReportEntity r) => new ReportInfoDto
    {
        Id = r.Id,
        Category = r.Category,
        Subject = r.Subject,
        Description = r.Description,
        Priority = r.Priority,
        Status = r.Status,
        Anonymous = r.Anonymous,
        UserId = r.UserId,
        CreatedAt = r.CreatedAt,
        UpdatedAt = r.UpdatedAt
    };
}