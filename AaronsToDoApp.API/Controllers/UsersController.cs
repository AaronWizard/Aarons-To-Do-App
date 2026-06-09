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
    [ProducesResponseType(typeof(AccessTokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AccessTokenDto>> Login(
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
            var authInfo = await authTokensService.LoginAsync(user);
            return ReturnAccessToken(authInfo);
        }
    }

    [HttpPost("refresh-access")]
    [ProducesResponseType(typeof(AccessTokenDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AccessTokenDto>> RefreshAccess()
    {
        if (TryGetRefreshToken(out var refreshToken))
        {
            try
            {
                var authInfo = await authTokensService.RefreshAccessAsync(
                    refreshToken ?? string.Empty
                );
                return ReturnAccessToken(authInfo);
            }
            catch (SecurityTokenException)
            {
                return Unauthorized();
            }
        }
        else
        {
            return Unauthorized();
        }

    }

    [HttpPost("revoke-refresh-token")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RevokeRefreshToken()
    {
        if (TryGetRefreshToken(out var refreshToken))
        {
            try
            {
                await authTokensService.RevokeRefreshTokenAsync(
                    refreshToken ?? "");
                ClearRefreshTokenCookie();
                return NoContent();
            }
            catch (SecurityTokenException)
            {
                return Unauthorized();
            }
        }
        else
        {
            return Unauthorized();
        }
    }

    private const string RefreshTokenCookie = "AaronsToDoAppRefreshToken";

    private AccessTokenDto ReturnAccessToken(AuthTokensService.AuthInfo info)
    {
        Response.Cookies.Append(
            RefreshTokenCookie,
            info.refreshToken,
            info.refreshTokenCookieOptions
        );
        return new AccessTokenDto(info.accessToken);
    }

    private void ClearRefreshTokenCookie()
    {
        Response.Cookies.Delete(
            RefreshTokenCookie,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            }
        );
    }

    private bool TryGetRefreshToken(out string? token)
    {
        return Request.Cookies.TryGetValue(RefreshTokenCookie, out token);
    }
}
