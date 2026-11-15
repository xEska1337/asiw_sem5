using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Cars.API.Services;

public class EmailService(IOptions<EmailSettings> options) : IEmailService
{
    private readonly EmailSettings _settings = options.Value;

    public async Task SendAsync(string to, string subject, string htmlBody)
    {
        var message = new MimeMessage();

        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        message.Body = new BodyBuilder { HtmlBody = htmlBody }.ToMessageBody();

        using var client = new SmtpClient();

        await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_settings.UserName, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}