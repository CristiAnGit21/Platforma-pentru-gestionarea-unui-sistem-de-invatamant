using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.Group;

public class GroupCreateDto
{
    [Required(ErrorMessage = "Numele grupei este obligatoriu.")]
    public string Name { get; set; }

    [Range(1, 6, ErrorMessage = "Anul trebuie să fie între 1 și 6.")]
    public int Year { get; set; }
}