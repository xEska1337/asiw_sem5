namespace Cars.API.DTOs;

public record RegisterDto(
    string UserName,
    string Email,
    string Password);