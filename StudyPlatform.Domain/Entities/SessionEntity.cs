namespace StudyPlatform.Domain.Entities;

public class SessionEntity
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string CookieString { get; set; } = string.Empty;
    public DateTime ExpireTime { get; set; }
}
