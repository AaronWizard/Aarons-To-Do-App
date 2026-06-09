using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AaronsToDoApp.API.Data;
using AaronsToDoApp.API.DTOs;
using AaronsToDoApp.API.Models;
using AaronsToDoApp.API.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AaronsToDoApp.API.Services;

public partial class AuthTokensService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly AppDbContext _database;
    private readonly AuthenticationOptions _authOptions;

    public AuthTokensService(
        UserManager<IdentityUser> userManager,
        AppDbContext database,
        IOptions<AuthenticationOptions> authOptions)
    {
        _userManager = userManager;
        _database = database;
        _authOptions = authOptions.Value;
    }

    public async Task<AuthTokensDto> LoginAsync(IdentityUser user)
    {
        var now = DateTime.UtcNow;
        // Log out of other sessions.
        var existingTokens = await _database.RefreshTokens
            .Where(t =>
                (t.UserId == user.Id)
                && (t.ExpiresUTC <= now)
                && (t.RevokedUTC == null)
            ).ToListAsync();
        existingTokens.ForEach(t => t.RevokedUTC = now);

        var authTokens = await CreateAuthTokensAsync(user);
        await _database.SaveChangesAsync();

        return authTokens;
    }

    public async Task<AuthTokensDto> RefreshAccessAsync(string refreshToken)
    {
        var existingToken = await _database.RefreshTokens
            .Include(t => t.User)
            .SingleOrDefaultAsync(t => t.Token == refreshToken)
            ?? throw new SecurityTokenException("Invalid refresh token");

        if (!existingToken.IsActive)
        {
            throw new SecurityTokenException(
                "Refresh token expired or revoked"
            );
        }

        // Log out of given session.
        existingToken.RevokedUTC = DateTime.UtcNow;

        var authTokens = await CreateAuthTokensAsync(existingToken.User!);
        await _database.SaveChangesAsync();

        return authTokens;
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        var existingToken = await _database.RefreshTokens
            .SingleOrDefaultAsync(t => t.Token == refreshToken)
            ?? throw new SecurityTokenException("Invalid refresh token");

        if (!existingToken.IsActive)
        {
            throw new SecurityTokenException(
                "Refresh token is already inactive"
            );
        }

        existingToken.RevokedUTC = DateTime.UtcNow;
        await _database.SaveChangesAsync();
    }

    private async Task<AuthTokensDto> CreateAuthTokensAsync(IdentityUser user)
    {
        var accessToken = CreateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id);
        return new AuthTokensDto(accessToken, refreshToken);
    }

    private string CreateAccessToken(IdentityUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_authOptions.SecurityKey)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _authOptions.Issuer,
            audience: _authOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _authOptions.AccessTokenLifetimeMinutes
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<string> CreateRefreshTokenAsync(string userId)
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var tokenValue = Convert.ToBase64String(randomNumber);

        var newToken = new RefreshToken
        {
            Token = tokenValue,
            UserId = userId,
            ExpiresUTC = DateTime.UtcNow.AddHours(
                 _authOptions.RefreshTokenLifetimeHours
             )
        };
        _database.RefreshTokens.Add(newToken);

        return tokenValue;
    }
}
