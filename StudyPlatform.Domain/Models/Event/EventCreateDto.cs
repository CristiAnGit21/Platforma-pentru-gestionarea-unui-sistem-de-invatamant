using System.ComponentModel.DataAnnotations;
using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Models.Event;

public class EventCreateDto
{
    [Required(ErrorMessage = "Titlul evenimentului este obligatoriu.")]
    public string Title { get; set; }

    public EventType Type { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Ora de început este obligatorie.")]
    [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "Formatul orei trebuie să fie HH:mm.")]
    public string StartTime { get; set; }

    [Required(ErrorMessage = "Ora de sfârșit este obligatorie.")]
    [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "Formatul orei trebuie să fie HH:mm.")]
    public string EndTime { get; set; }

    [Required(ErrorMessage = "Locația evenimentului este obligatorie.")]
    public string Location { get; set; }

    public Guid? ProfessorId { get; set; }
    public string? ProfessorName { get; set; }
    public string? Description { get; set; }
}