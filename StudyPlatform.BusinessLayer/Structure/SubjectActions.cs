using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Subject;

namespace StudyPlatform.BusinessLayer.Structure;

public class SubjectActions
{
    public bool CreateSubject(SubjectCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var subject = new SubjectEntity { Name = dto.Name.Trim() };
            context.Subjects.Add(subject);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare materie: {ex.Message}"); return false; }
    }

    public bool UpdateSubject(Guid id, SubjectInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var subject = context.Subjects.FirstOrDefault(x => x.Id == id);
            if (subject is null) return false;
            subject.Name = dto.Name.Trim();
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update materie: {ex.Message}"); return false; }
    }

    public bool DeleteSubject(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var subject = context.Subjects.FirstOrDefault(x => x.Id == id);
            if (subject is null) return false;
            context.Subjects.Remove(subject);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere materie: {ex.Message}"); return false; }
    }

    public SubjectInfoDto? GetSubjectById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var subject = context.Subjects.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (subject is null) return null;
            return new SubjectInfoDto { Id = subject.Id, Name = subject.Name };
        }
        catch { return null; }
    }

    public List<SubjectInfoDto> GetSubjectList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Subjects.AsNoTracking()
                .Select(x => new SubjectInfoDto { Id = x.Id, Name = x.Name })
                .ToList();
        }
        catch { return new List<SubjectInfoDto>(); }
    }
}