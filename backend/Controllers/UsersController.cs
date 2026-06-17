using ittask4.Application.Dto;
using ittask4.Application.Service;
using Microsoft.AspNetCore.Mvc;

namespace ittask4.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;
    private readonly IEmailService _emailService;

    public UsersController(IUsersService usersService, IEmailService emailService)
    {
        _usersService = usersService;
        _emailService = emailService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequestDto userLoginDto)
    {
        try
        {
            var result = await _usersService.LoginUser(userLoginDto);
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "NOT_FOUND" => NotFound(result.Message),
                    "BLOCKED" => StatusCode(StatusCodes.Status403Forbidden, result.Message),
                    "Unknown_Error" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }

        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");

        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequestDto userDto)
    {
        try
        {
            var result = await _usersService.RegisterUser(userDto);
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Accepted(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "USER_EXISTS" => Conflict(result.Message),
                    "REGISTRATION_ERROR" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");
        }
    }

    [HttpGet]
    [ServiceFilter<ValidateUserFilter>]
    public async Task<IActionResult> GetUsersList()
    {
        try
        {
            var result = await _usersService.GetAllUsers();
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "NOT_FOUND" => NotFound(result.Message),
                    "USER_BLOCKED" => StatusCode(StatusCodes.Status403Forbidden, result.Message ?? "Sorry, blocked user can't perform this action."),
                    "NO_TARGET_USERS" => BadRequest(result.Message),
                    "INVALID_USER_ID" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");
        }
    }

    [HttpDelete]
    [ServiceFilter<ValidateUserFilter>]
    public async Task<IActionResult> DeleteUser(
        [FromBody] UserActionRequestDto request
    )
    {
        try
        {
            var result = await _usersService.DeleteUser(request);
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "NOT_FOUND" => NotFound(result.Message),
                    "USER_BLOCKED" => StatusCode(StatusCodes.Status403Forbidden, result.Message ?? "Sorry, blocked user can't perform this action."),
                    "NO_TARGET_USERS" => BadRequest(result.Message),
                    "INVALID_USER_ID" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");
        }
    }

    [HttpPost("block")]
    [ServiceFilter<ValidateUserFilter>]
    public async Task<IActionResult> BlockUser([FromBody] UserActionRequestDto request)
    {
        try
        {
            var result = await _usersService.BlockUser(request);
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "NOT_FOUND" => NotFound(result.Message),
                    "USER_BLOCKED" => StatusCode(StatusCodes.Status403Forbidden, result.Message ?? "Sorry, blocked user can't perform this action."),
                    "NO_TARGET_USERS" => BadRequest(result.Message),
                    "INVALID_USER_ID" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");
        }
    }

    [HttpPost("unblock")]
    [ServiceFilter<ValidateUserFilter>]
    public async Task<IActionResult> UnblockUser([FromBody] UserActionRequestDto request)
    {
        try
        {
            var result = await _usersService.UnblockUser(request);
            if (result == null)
            {
                return BadRequest("An error occurred while processing the request.");
            }

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            else
            {
                return result.ErrorCode switch
                {
                    "NOT_FOUND" => NotFound(result.Message),
                    "NO_TARGET_USERS" => BadRequest(result.Message),
                    "INVALID_USER_ID" => BadRequest(result.Message),
                    _ => BadRequest(result.Message)
                };
            }
        }
        catch (Exception)
        {
            return BadRequest("An unexpected error occurred.");
        }
    }

    [HttpPost("active")]
    [ServiceFilter<ValidateUserFilter>]
    public async Task<IActionResult> UserActive([FromHeader] string UserId)
    {
        var result = await _usersService.UpdateUserActivity(UserId);
        return Ok(result.Message);
    }

    [HttpGet("confirm")]
    public async Task<IActionResult> VerifyEmail(string u)
    {
        if (string.IsNullOrEmpty(u))
        {
            return BadRequest("User identifier is required.");
        }

        var result = await _usersService.ValidateUser(u);
        if (!result.IsSuccess)
        {
            return BadRequest(result.Message ?? "Validation failed.");
        }

        var activated = await _usersService.ActivateUser(u);
        if (!activated.IsSuccess)
        {
            return StatusCode(500, "Activation could not be completed.");
        }

        string htmlResponse = @"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verified</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            </style>
        </head>
        <body>
            <h2>Verification Successful!</h2>
            <p>Your email has been verified. You can safely close this tab and return to the app.</p>
            <script>
                window.close();
            </script>
        </body>
        </html>";

        return Content(htmlResponse, "text/html");
    }

}
