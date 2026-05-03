using System.Security.Cryptography;
using System.Text;

namespace StudyPlatform.Helpers;

public static class CookieGenerator
{
    private const string SaltData = "StudyPlatformTW2018SecureSaltXYZ!";
    private static readonly byte[] Salt = Encoding.ASCII.GetBytes(SaltData);
    private const string SharedSecret = "StudyPlatformAES256KeyTW2018Sec!";

    public static string Create(string value)
        => EncryptStringAes(value, SharedSecret);

    public static string Validate(string value)
        => DecryptStringAes(value, SharedSecret);

    private static string EncryptStringAes(string plainText, string sharedSecret)
    {
        using var keyDeriv = new Rfc2898DeriveBytes(sharedSecret, Salt, 1000, HashAlgorithmName.SHA256);
        using var aes = Aes.Create();
        aes.Key = keyDeriv.GetBytes(32);
        aes.GenerateIV();

        using var ms = new MemoryStream();
        ms.Write(aes.IV, 0, aes.IV.Length);
        using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
            sw.Write(plainText);

        return Convert.ToBase64String(ms.ToArray());
    }

    private static string DecryptStringAes(string cipherText, string sharedSecret)
    {
        var fullCipher = Convert.FromBase64String(cipherText);
        using var keyDeriv = new Rfc2898DeriveBytes(sharedSecret, Salt, 1000, HashAlgorithmName.SHA256);
        using var aes = Aes.Create();
        aes.Key = keyDeriv.GetBytes(32);

        var iv = new byte[aes.BlockSize / 8];
        Array.Copy(fullCipher, 0, iv, 0, iv.Length);
        aes.IV = iv;

        using var ms = new MemoryStream(fullCipher, iv.Length, fullCipher.Length - iv.Length);
        using var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);
        return sr.ReadToEnd();
    }
}
