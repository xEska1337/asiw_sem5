using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Cars.API.Services;

public class TokenService(
    IConfiguration configuration,
    UserManager<AppUser> userManager) : ITokenService
{
    public async Task<string> CreateTokenAsync(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var keyText = configuration["Jwt:Key"]
                      ?? throw new InvalidOperationException("Brak Jwt:Key.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyText));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresMinutes = configuration.GetValue<int>("Jwt:ExpiresMinutes");

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}