using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Entities;

public class ReportEntity
{
    public Guid Id { get; set; }
    public ReportCategory Category { get; set; }
    public string Subject { get; set; }
    public string Description { get; set; }
    public ReportPriority Priority { get; set; }
    public ReportStatus Status { get; set; }
    public bool Anonymous { get; set; }
    public Guid? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}