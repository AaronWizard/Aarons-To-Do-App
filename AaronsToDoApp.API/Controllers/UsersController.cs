using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AaronsToDoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(
    UsersService usersService,
    AuthTokensService authTokensService
) : ControllerBase
{
    public record RegisterDto(string Email, string Password);
    public record LoginDto(string Email, string Password);

    public record RefreshTokenDto(string RefreshToken);

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
        var user = await usersService.GetUserForLogin(
            request.Email, request.Password
        );
        if (user == null)
        {
            return Unauthorized();
        }
        else
        {
            var authTokens = await authTokensService.LoginAsync(user);
            return Ok(authTokens);
        }
    }

    [HttpPost("refresh-access")]
    public async Task<IActionResult> RefreshAccess(
        [FromBody] RefreshTokenDto refreshToken
    )
    {
        try
        {
            var accessTokens = await authTokensService.RefreshAccessAsync(
                refreshToken.RefreshToken
            );
            return Ok(accessTokens);
        }
        catch (SecurityTokenException)
        {
            return BadRequest();
        }
    }

    [HttpPost("revoke-refresh-token")]
    public async Task<IActionResult> RevokeRefreshToken(
        [FromBody] RefreshTokenDto refreshToken
    )
    {
        try
        {
            await authTokensService.RevokeRefreshTokenAsync(
                refreshToken.RefreshToken);
            return NoContent();
        }
        catch (SecurityTokenException)
        {
            return BadRequest();
        }
    }
}
