using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required] public string DisplayName { get; set; }

    [Required] [EmailAddress] public string Email { get; set; }

    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$",
        ErrorMessage =
            "Your password must contain at least one uppercase letter, one lowercase letter, one number, and one special character. It must also be between 4 and 16 characters in length.")]
    public string Password { get; set; }

    [Required] public string Username { get; set; }
}