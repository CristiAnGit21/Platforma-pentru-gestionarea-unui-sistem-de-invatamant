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
            var subject = new SubjectEntity { Name = dto.Name.Trim(), ProfessorId = dto.ProfessorId };
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
            subject.ProfessorId = dto.ProfessorId;
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
            var result = context.Subjects.AsNoTracking()
                .Where(x => x.Id == id)
                .GroupJoin(
                    context.Users.AsNoTracking(),
                    s => s.ProfessorId,
                    u => (Guid?)u.Id,
                    (s, users) => new { s, users })
                .SelectMany(
                    x => x.users.DefaultIfEmpty(),
                    (x, u) => new SubjectInfoDto
                    {
                        Id = x.s.Id,
                        Name = x.s.Name,
                        ProfessorId = x.s.ProfessorId,
                        ProfessorName = u != null ? u.FirstName + " " + u.LastName : null,
                    })
                .FirstOrDefault();
            return result;
        }
        catch { return null; }
    }

    public List<SubjectInfoDto> GetSubjectList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Subjects.AsNoTracking()
                .GroupJoin(
                    context.Users.AsNoTracking(),
                    s => s.ProfessorId,
                    u => (Guid?)u.Id,
                    (s, users) => new { s, users })
                .SelectMany(
                    x => x.users.DefaultIfEmpty(),
                    (x, u) => new SubjectInfoDto
                    {
                        Id = x.s.Id,
                        Name = x.s.Name,
                        ProfessorId = x.s.ProfessorId,
                        ProfessorName = u != null ? u.FirstName + " " + u.LastName : null,
                    })
                .ToList();
        }
        catch { return new List<SubjectInfoDto>(); }
    }
}