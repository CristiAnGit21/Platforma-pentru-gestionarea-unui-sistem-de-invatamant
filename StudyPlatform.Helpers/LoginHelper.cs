namespace StudyPlatform.Helpers;

public static class LoginHelper
{
    public static string HashGen(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password);

    public static bool Verify(string password, string hash) =>
        BCrypt.Net.BCrypt.Verify(password, hash);
}
