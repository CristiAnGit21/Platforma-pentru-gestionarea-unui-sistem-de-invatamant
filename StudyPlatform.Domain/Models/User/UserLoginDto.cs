using System.ComponentModel.DataAnnotations;

namespace StudyPlatform.Domain.Models.User;

public class UserLoginDto
{
    [Required(ErrorMessage = "Email-ul este obligatoriu.")]
    [EmailAddress(ErrorMessage = "Adresa de email nu este validă.")]
    public string Credential { get; set; } = string.Empty;

    [Required(ErrorMessage = "Parola este obligatorie.")]
    [MinLength(6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere.")]
    public string Password { get; set; } = string.Empty;
}
