namespace StudyPlatform.Domain.Models;

public static class JwtSettings
{
    public const string Issuer = "StudyPlatform";
    public const string Audience = "StudyPlatformClient";
    public const string SecretKey = "StudyPlatformSuperSecretKey2026!!XyZ";
    public const int ExpirationMinutes = 60;
}
