using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Grade;

namespace StudyPlatform.BusinessLayer.Structure;

public class GradeActions
{
    public bool CreateGrade(GradeCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var grade = new GradeEntity
            {
                Value = dto.Value,
                Date = dto.Date,
                SubjectId = dto.SubjectId,
                StudentId = dto.StudentId
            };
            context.Grades.Add(grade);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare notă: {ex.Message}"); return false; }
    }

    public bool UpdateGrade(Guid id, GradeInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var grade = context.Grades.FirstOrDefault(x => x.Id == id);
            if (grade is null) return false;
            grade.Value = dto.Value;
            grade.Date = dto.Date;
            grade.SubjectId = dto.SubjectId;
            grade.StudentId = dto.StudentId;
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update notă: {ex.Message}"); return false; }
    }

    public bool DeleteGrade(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var grade = context.Grades.FirstOrDefault(x => x.Id == id);
            if (grade is null) return false;
            context.Grades.Remove(grade);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere notă: {ex.Message}"); return false; }
    }

    public GradeInfoDto? GetGradeById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var grade = context.Grades.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (grade is null) return null;
            return new GradeInfoDto { Id = grade.Id, Value = grade.Value, Date = grade.Date, SubjectId = grade.SubjectId, StudentId = grade.StudentId };
        }
        catch { return null; }
    }

    public List<GradeInfoDto> GetGradeList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Grades.AsNoTracking()
                .Select(x => new GradeInfoDto { Id = x.Id, Value = x.Value, Date = x.Date, SubjectId = x.SubjectId, StudentId = x.StudentId })
                .ToList();
        }
        catch { return new List<GradeInfoDto>(); }
    }

    public List<GradeInfoDto> GetGradesByStudent(Guid studentId)
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Grades.AsNoTracking()
                .Where(x => x.StudentId == studentId)
                .Select(x => new GradeInfoDto { Id = x.Id, Value = x.Value, Date = x.Date, SubjectId = x.SubjectId, StudentId = x.StudentId })
                .ToList();
        }
        catch { return new List<GradeInfoDto>(); }
    }
}