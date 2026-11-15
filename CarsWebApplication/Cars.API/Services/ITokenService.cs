using Cars.Domain;

namespace Cars.API.Services;

public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
}