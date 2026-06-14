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
        public async Task<ServiceResult<bool>> ValidateUser(string userId)
        {
            var user = await _ctx.Users.FindAsync(Guid.Parse(userId));
            if (user == null)
            {
                return ServiceResult<bool>.Failure("Invalid User ID.", "NOT_FOUND");
            }

            if (user.Status == UserStatus.Blocked)
            {
                return ServiceResult<bool>.Failure("Sorry, blocked user can't perform this action.", "USER_BLOCKED");
            }

            return ServiceResult<bool>.Success(true, "User exists.");
        }

        public async Task<ServiceResult<UserActionResponseDto>> DeleteUser(UserActionRequestDto dto)
        {
            if (dto.TargetUserIds == null || dto.TargetUserIds.Count == 0)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Please select at least one user to delete.",
                    "NO_TARGET_USERS"
                );
            }

            var userIdsToDelete = new List<Guid>();
            int invalidIdsCount = 0;
            foreach (var targetId in dto.TargetUserIds.Distinct())
            {
                if (Guid.TryParse(targetId, out var parsedId))
                {
                    userIdsToDelete.Add(parsedId);
                }
                else
                {
                    invalidIdsCount++;
                }
            }

            if (invalidIdsCount > 0)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "One or more selected users are invalid. Please refresh the page and try again.",
                    "INVALID_USER_ID"
                );
            }

            try
            {
                int rowsDeleted = await _ctx.Users
                    .Where(u => userIdsToDelete.Contains(u.Id))
                    .ExecuteDeleteAsync();

                if (rowsDeleted == 0)
                {
                    return ServiceResult<UserActionResponseDto>.Failure(
                        "Unable to delete the selected users.",
                        "NOT_FOUND"
                    );
                }

                return ServiceResult<UserActionResponseDto>.Success(
                    new UserActionResponseDto()
                    {
                        Success = true,
                        Message = $"Successfully deleted {rowsDeleted} user(s)."
                    }, ""
                );
            }
            catch (Exception)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Something went wrong. Please try again.",
                    "DELETION_ERROR"
                );
            }
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

        public async Task<ServiceResult<UserListResponseDto>> GetAllUsers()
        {
            try
            {
                var users = await _ctx.Users.ToListAsync();
                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id.ToString(),
                    Name = u.Name,
                    Email = u.Email,
                    Organization_Affiliation = u.Organization_Affiliation,
                    Status = u.Status.ToString(),
                    CreatedAt = u.CreatedAt
                }).ToList();

                return ServiceResult<UserListResponseDto>.Success(
                    new UserListResponseDto()
                    {
                        Success = true,
                        Users = userDtos
                    }, "Users retrieved successfully.");
            }
            catch (Exception)
            {
                return ServiceResult<UserListResponseDto>.Failure("An error occurred while retrieving users.", "RETRIEVAL_ERROR");
            }
        }
    }
}
