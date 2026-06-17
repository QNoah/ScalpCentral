using System.Security.Cryptography;
using System.Text;
public class Hasher
{
    public string GenerateHash(string message, string key)
    {
        using (var hmacsha256 = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
        {
            byte[] hash = hmacsha256.ComputeHash(Encoding.UTF8.GetBytes(message));
            return Convert.ToBase64String(hash);
        }
    }
}