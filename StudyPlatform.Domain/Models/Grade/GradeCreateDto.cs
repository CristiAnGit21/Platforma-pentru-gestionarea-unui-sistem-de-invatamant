using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.Grade;

public class GradeCreateDto
{
    [Range(1, 10, ErrorMessage = "Nota trebuie să fie între 1 și 10.")]
    public int Value { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Materia este obligatorie.")]
    public Guid SubjectId { get; set; }

    [Required(ErrorMessage = "Studentul este obligatoriu.")]
    public Guid StudentId { get; set; }
}