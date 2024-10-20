using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;

public class TokenValidator(ConfigurationManager configuration)
{
    private async Task<SecurityKey> GetSigningKey(string jwtToken)
    {
        using (HttpClient httpClient = new HttpClient())
        {
            var response = await httpClient.GetStringAsync($"https://{configuration["SPA:Domain"]}/.well-known/jwks.json");
            var jwks = JObject.Parse(response);
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtTokenDecoded = jwtHandler.ReadJwtToken(jwtToken);
            var keyId = jwtTokenDecoded.Header.Kid;
            var signingKey = jwks["keys"]!.First(k => k["kid"]!.ToString() == keyId);
            var modulus = signingKey["n"]!.ToString();
            var exponent = signingKey["e"]!.ToString();
            var rsa = new RSAParameters
            {
                Modulus = Base64UrlEncoder.DecodeBytes(modulus),
                Exponent = Base64UrlEncoder.DecodeBytes(exponent)
            };
            return new RsaSecurityKey(rsa);
        }
    }


    public async Task<ClaimsPrincipal?> ValidateToken(string token)
    {
        var signingKey = await GetSigningKey(token);
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://{configuration["SPA:Domain"]}/",
            ValidateAudience = false,
            ValidAudience = configuration["SPA:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = false
        };
        var handler = new JwtSecurityTokenHandler();

        try
        {
            var claimsPrincipal = handler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
            return claimsPrincipal;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return null;
        }
    }
}
