using System.ComponentModel.DataAnnotations;

namespace ittask4.Domain.Entities
{
    public enum UserStatus
    {
        Unverified = 0,
        Active = 1,
        Blocked = 2,
    }

    public class Activity
    {
        public DateTime LastSeen { get; set; }
        public int DurationInMinutes { get; set; }
    }
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public required string Name { get; set; }

        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Organization_Affiliation { get; set; }
        public UserStatus Status { get; set; } = (int)UserStatus.Unverified;
        public List<Activity>? LastActivities { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

