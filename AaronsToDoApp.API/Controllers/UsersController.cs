using AaronsToDoApp.API.DTOs;
using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Identity;
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
    [HttpGet("password-requirements")]
    public PasswordOptions PasswordRequirements()
    {
        return usersService.PasswordOptions;
    }

    [HttpPost("[action]")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
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
    [ProducesResponseType(typeof(AuthTokensDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthTokensDto>> Login(
        [FromBody] LoginDto request)
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
            var authTokensDto = await authTokensService.LoginAsync(user);
            return authTokensDto;
        }
    }

    [HttpPost("refresh-access")]
    [ProducesResponseType(typeof(AuthTokensDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthTokensDto>> RefreshAccess(
        [FromBody] RefreshTokenDto refreshToken
    )
    {
        try
        {
            var authTokensDto = await authTokensService.RefreshAccessAsync(
                refreshToken.RefreshToken
            );
            return authTokensDto;
        }
        catch (SecurityTokenException)
        {
            return BadRequest();
        }
    }

    [HttpPost("revoke-refresh-token")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
