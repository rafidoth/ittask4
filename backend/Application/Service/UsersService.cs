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
        private readonly IEmailService _emailService;
        private readonly IHttpContextAccessor _httpCtx;

        public UsersService(ApplicationDbContext dbContext, IEmailService emailService, IHttpContextAccessor httpCtx)
        {
            _ctx = dbContext;
            _emailService = emailService;
            _httpCtx = httpCtx;
        }

        public async Task<ServiceResult<bool>> ValidateUser(string userId)
        {
            var user = await _ctx.Users.FindAsync(Guid.Parse(userId));
            if (user == null)
            {
                return ServiceResult<bool>.Failure("User doesn't exist.", "NOT_FOUND");
            }

            if (user.Status == UserStatus.Blocked)
            {
                return ServiceResult<bool>.Failure("You're blocked user. ", "USER_BLOCKED");
            }

            return ServiceResult<bool>.Success(true, "User exists.");
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
                int rowInserted = await _ctx.SaveChangesAsync();
                if (rowInserted == 1)
                {
                    try
                    {
                        var request = _httpCtx.HttpContext!.Request!;
                        var baseUrl = $"{request.Scheme}://{request.Host}";
                        var verificationLink = $"{baseUrl}/confirm?u={user.Id}";
                        await _emailService.SendEmailAsync(user.Email, "Verify your email | ITTASK4", verificationLink);
                    }
                    catch (Exception e)
                    {
                        ServiceResult<UserRegisterResponseDto>.Failure(e.Message, "EMAIL_FAIL");
                    }
                }

                return ServiceResult<UserRegisterResponseDto>.Success(
                        new UserRegisterResponseDto()
                        {
                            Success = true,
                            Name = user.Name,
                            Email = user.Email
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
                    return ServiceResult<UserLoginResponseDto>.Failure("Invalid credentials, please try again", "NOT_FOUND");
                }

                if (user.Status == UserStatus.Blocked)
                {
                    return ServiceResult<UserLoginResponseDto>.Failure("Your account is blocked. Contact support.", "BLOCKED");
                }

                return ServiceResult<UserLoginResponseDto>.Success(
                    new UserLoginResponseDto()
                    {
                        Success = true,
                        UserId = user.Id.ToString(),
                        Name = user.Name,
                        Email = user.Email,
                        Organization_Affiliation = user.Organization_Affiliation,
                    }, "Login Successful!");
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
                    LastSeen = u.LastSeen,
                    ActivitesInMinutes = u.ActivitesInMinutes,
                    LastLogin = u.LastLogin,
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

        public async Task<ServiceResult<UserActionResponseDto>> BlockUser(UserActionRequestDto dto)
        {
            if (dto.TargetUserIds == null || dto.TargetUserIds.Count == 0)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Please select at least one user to block.",
                    "NO_TARGET_USERS"
                );
            }

            var userIdsToBlock = new List<Guid>();
            int invalidIdsCount = 0;
            foreach (var targetId in dto.TargetUserIds.Distinct())
            {
                if (Guid.TryParse(targetId, out var parsedId))
                {
                    userIdsToBlock.Add(parsedId);
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
                .Where(u => userIdsToBlock.Contains(u.Id))
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(u => u.Status, UserStatus.Blocked)
                );

                if (rowsDeleted == 0)
                {
                    return ServiceResult<UserActionResponseDto>.Failure(
                        "Unable to block the selected users.",
                        "NOT_FOUND"
                    );
                }

                return ServiceResult<UserActionResponseDto>.Success(
                    new UserActionResponseDto()
                    {
                        Success = true,
                        Message = $"Successfully blocked {rowsDeleted} user(s)."
                    }, ""
                );
            }
            catch (Exception)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Something went wrong. Please try again.",
                    "BLOCK_ERROR"
                );
            }
        }

        public async Task<ServiceResult<UserActionResponseDto>> UnblockUser(UserActionRequestDto dto)
        {
            if (dto.TargetUserIds == null || dto.TargetUserIds.Count == 0)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Please select at least one user to unblock.",
                    "NO_TARGET_USERS"
                );
            }

            var userIdsToUnblock = new List<Guid>();
            int invalidIdsCount = 0;
            foreach (var targetId in dto.TargetUserIds.Distinct())
            {
                if (Guid.TryParse(targetId, out var parsedId))
                {
                    userIdsToUnblock.Add(parsedId);
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
                int rowsAffected = await _ctx.Users
                .Where(u => userIdsToUnblock.Contains(u.Id))
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(u => u.Status, UserStatus.Active)
                );

                if (rowsAffected == 0)
                {
                    return ServiceResult<UserActionResponseDto>.Failure(
                        "Unable to unblock the selected users.",
                        "NOT_FOUND"
                    );
                }

                return ServiceResult<UserActionResponseDto>.Success(
                    new UserActionResponseDto()
                    {
                        Success = true,
                        Message = $"Successfully unblocked {rowsAffected} user(s)."
                    }, ""
                );
            }
            catch (Exception)
            {
                return ServiceResult<UserActionResponseDto>.Failure(
                    "Something went wrong. Please try again.",
                    "UNBLOCK_ERROR"
                );
            }
        }

        public async Task<ServiceResult<string>> UpdateUserActivity(string UserId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var user = await _ctx.Users.FindAsync(Guid.Parse(UserId));
            if (user != null)
            {
                Dictionary<DateOnly, int> activities;
                if (user.ActivitesInMinutes == null)
                {
                    activities = Enumerable.Range(0, 7).ToDictionary(i => today.AddDays(i - 6), i => 0);
                }
                else
                {
                    activities = new Dictionary<DateOnly, int>(user.ActivitesInMinutes);
                }

                if (!activities.ContainsKey(today))
                {
                    var earliestDate = activities.Keys.Min();
                    activities.Remove(earliestDate);
                    activities[today] = 0;
                }

                activities[today] += 1;
                user.ActivitesInMinutes = activities;
                user.LastSeen = DateTime.UtcNow;
                await _ctx.SaveChangesAsync();
            }
            return ServiceResult<string>.Success("", $"{user.Name} acitivity updated");
        }

        public async Task<ServiceResult<bool>> ActivateUser(string UserId)
        {
            try
            {
                await _ctx.Users
                .Where(u => u.Id.ToString() == UserId)
                .ExecuteUpdateAsync(
                        setters => setters.SetProperty(u => u.Status, UserStatus.Active)
                    );
            }
            catch (Exception e)
            {
                return ServiceResult<bool>.Failure(e.Message, "ACTIVATION_FAILED");
            }
            return ServiceResult<bool>.Success(true, "Activation Success!");
        }
    }
}
