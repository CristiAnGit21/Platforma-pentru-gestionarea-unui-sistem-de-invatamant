using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.Attendance;

public class AttendanceCreateDto
{
    [Required]
    public DateTime Date { get; set; }

    public bool Present { get; set; }

    [Required(ErrorMessage = "Studentul este obligatoriu.")]
    public Guid StudentId { get; set; }

    [Required(ErrorMessage = "Materia este obligatorie.")]
    public Guid SubjectId { get; set; }
}