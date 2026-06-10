using AaronsToDoApp.API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace AaronsToDoApp.API.Services;

public class UsersService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly PasswordOptions _passwordOptions;

    public UsersService(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> identityOptions
    )
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

    public async Task<IdentityUser?> GetUserForLogin(
        string email, string password
    )
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

        return user;
    }

    public async Task<UserInfoDto?> GetUserInfoAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return null;
        }
        else
        {
            return new UserInfoDto(
                user.NormalizedEmail?.ToLowerInvariant() ?? ""
            );
        }
    }
}
