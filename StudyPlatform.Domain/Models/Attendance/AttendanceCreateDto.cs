namespace StudyPlatform.Domain.Models.Attendance;

public class AttendanceCreateDto
{
    public DateTime Date { get; set; }
    public bool Present { get; set; }
    public Guid StudentId { get; set; }
    public Guid SubjectId { get; set; }
}