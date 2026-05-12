using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.Subject;

public class SubjectCreateDto
{
    [Required(ErrorMessage = "Numele materiei este obligatoriu.")]
    [MinLength(2, ErrorMessage = "Numele materiei trebuie să aibă cel puțin 2 caractere.")]
    public string Name { get; set; }
}