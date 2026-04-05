using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Attendance;

namespace StudyPlatform.BusinessLayer.Structure;

public class AttendanceActions
{
    public bool CreateAttendance(AttendanceCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var record = new AttendanceEntity
            {
                Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
                Present = dto.Present,
                StudentId = dto.StudentId,
                SubjectId = dto.SubjectId
            };
            context.Attendances.Add(record);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare prezență: {ex.Message}"); return false; }
    }

    public bool UpdateAttendance(Guid id, AttendanceInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var record = context.Attendances.FirstOrDefault(x => x.Id == id);
            if (record is null) return false;
            record.Date = dto.Date;
            record.Present = dto.Present;
            record.StudentId = dto.StudentId;
            record.SubjectId = dto.SubjectId;
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update prezență: {ex.Message}"); return false; }
    }

    public bool DeleteAttendance(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var record = context.Attendances.FirstOrDefault(x => x.Id == id);
            if (record is null) return false;
            context.Attendances.Remove(record);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere prezență: {ex.Message}"); return false; }
    }

    public AttendanceInfoDto? GetAttendanceById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var record = context.Attendances.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (record is null) return null;
            return new AttendanceInfoDto { Id = record.Id, Date = record.Date, Present = record.Present, StudentId = record.StudentId, SubjectId = record.SubjectId };
        }
        catch { return null; }
    }

    public List<AttendanceInfoDto> GetAttendanceList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Attendances.AsNoTracking()
                .Select(x => new AttendanceInfoDto { Id = x.Id, Date = x.Date, Present = x.Present, StudentId = x.StudentId, SubjectId = x.SubjectId })
                .ToList();
        }
        catch { return new List<AttendanceInfoDto>(); }
    }

    public List<AttendanceInfoDto> GetAttendanceByStudent(Guid studentId)
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Attendances.AsNoTracking()
                .Where(x => x.StudentId == studentId)
                .Select(x => new AttendanceInfoDto { Id = x.Id, Date = x.Date, Present = x.Present, StudentId = x.StudentId, SubjectId = x.SubjectId })
                .ToList();
        }
        catch { return new List<AttendanceInfoDto>(); }
    }
}