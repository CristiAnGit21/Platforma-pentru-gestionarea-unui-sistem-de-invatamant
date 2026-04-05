using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Entities;

public class EventEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public EventType Type { get; set; }
    public DateTime Date { get; set; }
    public string StartTime { get; set; }   // "HH:mm"
    public string EndTime { get; set; }     // "HH:mm"
    public string Location { get; set; }
    public Guid? ProfessorId { get; set; }
    public string? ProfessorName { get; set; }
    public string? Description { get; set; }
}