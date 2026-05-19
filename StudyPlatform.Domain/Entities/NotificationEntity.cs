namespace StudyPlatform.Domain.Entities;

public class NotificationEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; }
    public string Message { get; set; }
    public string Type { get; set; } = "general";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedByUserId { get; set; }
}
