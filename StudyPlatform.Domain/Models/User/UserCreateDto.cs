using StudyPlatform.Domain.Entities.Enums;
namespace StudyPlatform.Domain.Models.User;

public class UserCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public UserRole Role { get; set; } // Folosim Enum-ul aici
}