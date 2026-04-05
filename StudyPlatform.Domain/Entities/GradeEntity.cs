namespace StudyPlatform.Domain.Entities;

public class GradeEntity
{
    public Guid Id { get; set; }
    public int Value { get; set; }       // 1–10
    public DateTime Date { get; set; }
    public Guid SubjectId { get; set; }
    public Guid StudentId { get; set; }
}