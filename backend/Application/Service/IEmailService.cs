using ittask4.Application.Dto;
using ittask4.Application.ServiceResults;

namespace ittask4.Application.Service
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}


