namespace ittask4.Application.Dto
{
    public class UserRegisterRequestDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Organization_Affiliation { get; set; }
    }

    public class UserRegisterResponseDto
    {
        public string? UserId { get; set; }
        public required bool Success { get; set; }
    }


    public class UserLoginRequestDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class Activity
    {
        public DateTime LastSeen { get; set; }
        public int DurationInMinutes { get; set; }
    }

    public class UserLoginResponseDto
    {
        public required bool Success { get; set; }
        public string? UserId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Organization_Affiliation { get; set; }
    }

    public class UserRequestDto
    {
        public required string UserId { get; set; }
    }

    public class UserDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Organization_Affiliation { get; set; }
        public required string Status { get; set; }
        public Dictionary<DateOnly, int>? ActivitesInMinutes { get; set; }
        public DateTime? LastSeen { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserListResponseDto
    {
        public required bool Success { get; set; }
        public List<UserDto>? Users { get; set; }
    }

    public class UserActionRequestDto
    {
        public required List<string> TargetUserIds { get; set; }
    }

    public class UserActionResponseDto
    {
        public required bool Success { get; set; }
        public string? Message { get; set; }
    }



}
