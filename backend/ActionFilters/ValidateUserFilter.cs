using ittask4.Application.Service;
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
        }

        if (string.IsNullOrEmpty(userId))
        {
            context.Result = new Microsoft.AspNetCore.Mvc.StatusCodeResult(403); // Forbidden
            return;
        }

        await next();
    }
}