namespace StudyPlatform.Domain.Models.Grade;

public class GradeCreateDto
{
    public int Value { get; set; }
    public DateTime Date { get; set; }
    public Guid SubjectId { get; set; }
    public Guid StudentId { get; set; }
}