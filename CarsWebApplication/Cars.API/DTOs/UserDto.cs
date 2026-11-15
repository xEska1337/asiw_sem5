namespace Cars.API.DTOs;

public record UserDto(
    string Id,
    string UserName,
    string Email,
    string Token,
    IReadOnlyCollection<string> Roles);