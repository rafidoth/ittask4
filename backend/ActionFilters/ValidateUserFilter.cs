using ittask4.Application.Service;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class ValidateUserFilter : ActionFilterAttribute
{
    private readonly IUsersService _usersService;

    public ValidateUserFilter(IUsersService usersService)
    {
        _usersService = usersService;
    }

    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var userId = context.HttpContext.Request.Headers["UserId"].ToString();
        if (string.IsNullOrEmpty(userId))
        {
            context.Result = new Microsoft.AspNetCore.Mvc.StatusCodeResult(403); // Forbidden
            return;
        }

        var result = await _usersService.ValidateUser(userId);
        if (result.IsSuccess)
        {
            await next();
            return;
        }

        context.Result = new ObjectResult(new { Message = result.Message })
        {
            StatusCode = StatusCodes.Status403Forbidden
        };
        return;
    }
}