using System.Security.Cryptography;
using System.Text;

namespace StudyPlatform.Helpers;

public static class LoginHelper
{
    public static string HashGen(string password)
    {
        var originalBytes = Encoding.Default.GetBytes(password + "twutm2018");
        var encodedBytes = MD5.HashData(originalBytes);
        return BitConverter.ToString(encodedBytes).Replace("-", "").ToLower();
    }
}
