using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AaronsToDoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(UsersService usersService) : ControllerBase
{
    public record RegisterDto(string Email, string Password);
    public record LoginDto(string Email, string Password);

    [HttpGet("password-requirements")]
    public IActionResult PasswordRequirements()
    {
        return Ok(usersService.PasswordOptions);
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        var result = await usersService.Register(
            request.Email, request.Password);
        if (!result.Succeeded)
        {
            var emailErrors = result.Errors.Where(
                e => e.Code == "InvalidEmail"
            );
            var passwordErrors = result.Errors.Where(
                e => e.Code.StartsWith("Password")
            );
            var allErrors = emailErrors.Concat(passwordErrors).Select(
                e => e.Description);

            return BadRequest(allErrors);
        }

        return Ok();
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        var result = await usersService.Login(request.Email, request.Password);
        if (result == null)
        {
            return Unauthorized();
        }
        else
        {
            return Ok(result);
        }
    }
}
