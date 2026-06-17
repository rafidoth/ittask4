using Resend;

namespace ittask4.Application.Service
{
    public class EmailService : IEmailService
    {
        private readonly IResend _resend;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IResend resend, ILogger<EmailService> logger)
        {
            _resend = resend;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var message = new EmailMessage
            {
                From = "verify@rafiulhasan.tech"
            };
            message.To.Add(to);
            message.Subject = subject;
            message.TextBody = body;

            var resp = await _resend.EmailSendAsync(message);

            _logger.LogInformation("Sent email, with Id = {EmailId}", resp.Content);
        }

    }
}