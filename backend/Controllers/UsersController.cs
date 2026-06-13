using ittask4.Application.Dto;
using ittask4.Application.Service;
using Microsoft.AspNetCore.Mvc;

namespace ittask4.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{

    private readonly IUsersService _usersService;
    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
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
    public async Task<IActionResult> Login([FromBody] UserRegisterRequestDto userDto)
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
                return Ok(result.Data);
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

}
