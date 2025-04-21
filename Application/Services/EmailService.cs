using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class EmailService : IEmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;

    public EmailService(string smtpServer, int smtpPort, string smtpUser, string smtpPass)
    {
        _smtpServer = smtpServer;
        _smtpPort = smtpPort;
        _smtpUser = smtpUser;
        _smtpPass = smtpPass;
    }

    public async Task<bool> SendVerificationEmail(string email, string confirmationLink)
    {
        try
        {
            using (var smtpClient = new SmtpClient(_smtpServer, _smtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
                smtpClient.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpUser),
                    Subject = "Email Verification",
                    Body = $"Please verify your email by clicking this link: <a href='{confirmationLink}'>Verify Email</a>",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await smtpClient.SendMailAsync(mailMessage);
            }

            return true;
        }
        catch (SmtpException ex)
        {
            // Handle exception (e.g., log the error)
            return false;
        }
    }

    public async Task<bool> SendNotificationEmailAsync(string email)
    {
        try
        {
            using (var smtpClient = new SmtpClient(_smtpServer, _smtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
                smtpClient.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpUser),
                    Subject = "Contacts Updated",
                    Body = $"Your contact information has been updated in the system.",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);

                await smtpClient.SendMailAsync(mailMessage);
            }

            return true;
        }
        catch (SmtpException ex)
        {
            // Handle exception (e.g., log the error)
            return false;
        }
    }
}

public interface IEmailService
{
    Task<bool> SendVerificationEmail(string email, string confirmationLink);
    Task<bool> SendNotificationEmailAsync(string email);
}