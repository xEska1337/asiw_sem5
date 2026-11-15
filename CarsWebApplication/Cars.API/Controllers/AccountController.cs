using System.Text;
using Cars.API.DTOs;
using Cars.API.Services;
using Cars.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Cars.API.Controllers;

public class AccountController(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    IEmailService emailService,
    IConfiguration configuration) : BaseApiController
{
    private async Task<UserDto> CreateUserDtoAsync(AppUser user)
    {
        var roles = await userManager.GetRolesAsync(user);

        return new UserDto(
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            await tokenService.CreateTokenAsync(user),
            [.. roles]);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto dto)
    {
        var user = new AppUser
        {
            UserName = dto.UserName.Trim(),
            Email = dto.Email.Trim(),
        };

        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(error => error.Description));
        }

        await userManager.AddToRoleAsync(user, "User");

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var clientBaseUrl = configuration["Client:BaseUrl"]
            ?? throw new InvalidOperationException("Missing Client:BaseUrl.");

        var confirmationUrl = $"{clientBaseUrl}/confirm-email"
            + $"?userId={Uri.EscapeDataString(user.Id)}"
            + $"&token={Uri.EscapeDataString(encodedToken)}";

        await emailService.SendAsync(
            user.Email!,
            "Confirm your Cars account",
            $"""
             <h2>Cars</h2>
             <p>Click the link below to activate your account:</p>
             <p><a href="{confirmationUrl}">Confirm email address</a></p>
             """);

        return Ok(new
        {
            message = "Account created. Check your e-mail and confirm your registration.",
        });
    }

    [HttpGet("confirm-email")]
    public async Task<ActionResult> ConfirmEmail(string userId, string token)
    {
        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(token))
        {
            return BadRequest("Missing parameters.");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            return BadRequest("Invalid user.");
        }

        string decodedToken;

        try
        {
            decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        }
        catch
        {
            return BadRequest("Invalid token.");
        }

        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
        {
            return BadRequest("Failed to confirm the account.");
        }

        return Ok(new { message = "The e-mail address has been confirmed." });
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());

        if (user is null)
        {
            return Unauthorized("Invalid e-mail or password.");
        }

        var passwordCorrect = await userManager.CheckPasswordAsync(user, dto.Password);

        if (!passwordCorrect)
        {
            return Unauthorized("Invalid e-mail or password.");
        }

        if (!user.EmailConfirmed)
        {
            return Unauthorized("Please confirm your e-mail address first.");
        }

        return Ok(await CreateUserDtoAsync(user));
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());

        if (user is null || !user.EmailConfirmed)
        {
            return Ok(new
            {
                message = "If the account exists, a message with a password reset link has been sent.",
            });
        }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var clientBaseUrl = configuration["Client:BaseUrl"]
            ?? throw new InvalidOperationException("Missing Client:BaseUrl.");

        var resetUrl = $"{clientBaseUrl}/reset-password"
            + $"?email={Uri.EscapeDataString(user.Email!)}"
            + $"&token={Uri.EscapeDataString(encodedToken)}";

        await emailService.SendAsync(
            user.Email!,
            "Reset your Cars password",
            $"""
             <h2>Cars</h2>
             <p>Click the link below to set a new password:</p>
             <p><a href="{resetUrl}">Change password</a></p>
             """);

        return Ok(new
        {
            message = "If the account exists, a message with a password reset link has been sent.",
        });
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());

        if (user is null)
        {
            return BadRequest("Failed to reset the password.");
        }

        string decodedToken;

        try
        {
            decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));
        }
        catch
        {
            return BadRequest("Invalid token.");
        }

        var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(error => error.Description));
        }

        return Ok(new { message = "The password has been changed." });
    }
}