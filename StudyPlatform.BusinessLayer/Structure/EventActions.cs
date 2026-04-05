using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Event;

namespace StudyPlatform.BusinessLayer.Structure;

public class EventActions
{
    public bool CreateEvent(EventCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var ev = new EventEntity
            {
                Title = dto.Title.Trim(),
                Type = dto.Type,
                Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Location = dto.Location.Trim(),
                ProfessorId = dto.ProfessorId,
                ProfessorName = dto.ProfessorName?.Trim(),
                Description = dto.Description?.Trim()
            };
            context.Events.Add(ev);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare eveniment: {ex.Message}"); return false; }
    }

    public bool UpdateEvent(Guid id, EventInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var ev = context.Events.FirstOrDefault(x => x.Id == id);
            if (ev is null) return false;
            ev.Title = dto.Title.Trim();
            ev.Type = dto.Type;
            ev.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
            ev.StartTime = dto.StartTime;
            ev.EndTime = dto.EndTime;
            ev.Location = dto.Location.Trim();
            ev.ProfessorId = dto.ProfessorId;
            ev.ProfessorName = dto.ProfessorName?.Trim();
            ev.Description = dto.Description?.Trim();
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update eveniment: {ex.Message}"); return false; }
    }

    public bool DeleteEvent(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var ev = context.Events.FirstOrDefault(x => x.Id == id);
            if (ev is null) return false;
            context.Events.Remove(ev);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere eveniment: {ex.Message}"); return false; }
    }

    public EventInfoDto? GetEventById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var ev = context.Events.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (ev is null) return null;
            return MapToDto(ev);
        }
        catch { return null; }
    }

    public List<EventInfoDto> GetEventList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Events.AsNoTracking().Select(ev => MapToDto(ev)).ToList();
        }
        catch { return new List<EventInfoDto>(); }
    }

    private static EventInfoDto MapToDto(EventEntity ev) => new EventInfoDto
    {
        Id = ev.Id,
        Title = ev.Title,
        Type = ev.Type,
        Date = ev.Date,
        StartTime = ev.StartTime,
        EndTime = ev.EndTime,
        Location = ev.Location,
        ProfessorId = ev.ProfessorId,
        ProfessorName = ev.ProfessorName,
        Description = ev.Description
    };
}