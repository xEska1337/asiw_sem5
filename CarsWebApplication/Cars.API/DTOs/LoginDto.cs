namespace Cars.API.DTOs;

public record LoginDto(
    string Email,
    string Password);