namespace Cars.API.DTOs;

public record ResetPasswordDto(
    string Email,
    string Token,
    string NewPassword);