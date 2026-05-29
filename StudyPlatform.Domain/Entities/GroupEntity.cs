namespace StudyPlatform.Domain.Entities;

public class GroupEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Year { get; set; }
    public string Specialization { get; set; } = string.Empty;
    public Guid? ProfessorId { get; set; }
}
