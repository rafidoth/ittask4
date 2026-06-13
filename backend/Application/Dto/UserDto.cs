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


}
