using System.ComponentModel.DataAnnotations;
using StudyPlatform.Domain.Entities.Enums;

namespace StudyPlatform.Domain.Models.User;

public class UserCreateDto
{
    [Required(ErrorMessage = "Prenumele este obligatoriu.")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Numele este obligatoriu.")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Email-ul este obligatoriu.")]
    [EmailAddress(ErrorMessage = "Adresa de email nu este validă.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Parola este obligatorie.")]
    [MinLength(6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere.")]
    public string Password { get; set; }

    public UserRole Role { get; set; }
    public UserStatus Status { get; set; } = UserStatus.Pending;
    public Guid? GroupId { get; set; }
}