namespace StudyPlatform.Domain.Entities.User;

public class ULoginData
{
    public string Credential { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? LoginIp { get; set; }
    public DateTime LoginDateTime { get; set; }
}
