namespace StudyPlatform.Domain.Entities.Enums;

public class UserEntity
{
    public Guid Id { get; set; } 
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public UserRole Role { get; set; } 
}