using ittask4.Application.Dto;
using ittask4.Domain.Entities;
using ittask4.Data;
using Microsoft.EntityFrameworkCore;
using ittask4.Application.ServiceResults;

namespace ittask4.Application.Service
{
    public class UsersService : IUsersService
    {
        private readonly ApplicationDbContext _ctx;

        public UsersService(ApplicationDbContext dbContext)
        {
            _ctx = dbContext;
        }

        public async Task<ServiceResult<UserRegisterResponseDto>> RegisterUser(UserRegisterRequestDto dto)
        {
            try
            {
                var doesExists = await _ctx.Users.AnyAsync(u => u.Email == dto.Email);
                if (doesExists)
                {
                    return ServiceResult<UserRegisterResponseDto>.Failure("User already exists. Try to Login.", "USER_EXISTS");
                }

                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = dto.Password,
                    Organization_Affiliation = dto.Organization_Affiliation
                };

                await _ctx.Users.AddAsync(user);
                await _ctx.SaveChangesAsync();
                return ServiceResult<UserRegisterResponseDto>.Success(
                        new UserRegisterResponseDto()
                        {
                            UserId = user.Id.ToString(),
                            Success = true
                        }
                        , "User registered successfully.");

            }
            catch (Exception)
            {
                return ServiceResult<UserRegisterResponseDto>.Failure("An error occurred while registering the user.", "REGISTRATION_ERROR");
            }

        }

        public async Task<ServiceResult<UserLoginResponseDto>> LoginUser(UserLoginRequestDto dto)
        {
            try
            {
                var user = await _ctx.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null || user.Password != dto.Password)
                {
                    return ServiceResult<UserLoginResponseDto>.Failure("Invalid credential, please try again", "NOT_FOUND");
                }
                return ServiceResult<UserLoginResponseDto>.Success(
                        new UserLoginResponseDto()
                        {
                            Success = true,
                            UserId = user.Id.ToString(),
                            Name = user.Name,
                            Email = user.Email,
                            Organization_Affiliation = user.Organization_Affiliation,
                        }
                        , "Login Successful!");
            }
            catch (Exception)
            {
                return ServiceResult<UserLoginResponseDto>.Failure("Unknown error occured, please contact", "Unknown_Error");
            }
        }

    }
}

