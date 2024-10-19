using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public class TokenValidator(ConfigurationManager configuration)
{
    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://{configuration["SPA:Domain"]}/",
            ValidateAudience = true,
            ValidAudience = configuration["SPA:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = false,
            SignatureValidator = delegate (string token, TokenValidationParameters parameters)
            {
                var jwt = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(token);
                return jwt;
            }
        };

        try
        {
            var claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return claimsPrincipal;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return null;
        }
    }
}
