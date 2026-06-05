using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AaronsToDoApp.API.Services;

public class UsersService
{
    public record AuthTokens(string AccessToken, string RefreshToken);

    private readonly UserManager<IdentityUser> _userManager;
    private readonly PasswordOptions _passwordOptions;

    public UsersService(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> identityOptions)
    {
        _userManager = userManager;
        _passwordOptions = identityOptions.Value.Password;
    }

    public PasswordOptions PasswordOptions
    {
        get => _passwordOptions;
    }

    public async Task<IdentityResult> Register(string email, string password)
    {
        var user = new IdentityUser { UserName = email, Email = email };
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<AuthTokens?> Login(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return null;
        }
        var passwordValid = await _userManager.CheckPasswordAsync(
            user, password);
        if (!passwordValid)
        {
            return null;
        }

        var accessToken = "test access token";
        var refreshToken = "test refresh token";

        return new AuthTokens(accessToken, refreshToken);
    }
}
