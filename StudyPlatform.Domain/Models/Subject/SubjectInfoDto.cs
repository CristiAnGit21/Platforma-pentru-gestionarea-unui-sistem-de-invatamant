namespace StudyPlatform.Domain.Models.Subject;

public class SubjectInfoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public Guid? ProfessorId { get; set; }
    public string? ProfessorName { get; set; }
}