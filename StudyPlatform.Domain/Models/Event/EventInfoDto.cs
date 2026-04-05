using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Models.Event;

public class EventInfoDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public EventType Type { get; set; }
    public DateTime Date { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string Location { get; set; }
    public Guid? ProfessorId { get; set; }
    public string? Description { get; set; }
}