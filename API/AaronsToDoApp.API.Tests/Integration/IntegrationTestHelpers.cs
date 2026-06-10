using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using AaronsToDoApp.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AaronsToDoApp.API.Tests.Integration;

public static class IntegrationTestHelpers
{
    /// <summary>
    /// The signing key to use for API integration tests that require
    /// authentication.
    /// </summary>
    public static readonly SymmetricSecurityKey TestSigningKey = new(
        Encoding.UTF8.GetBytes("test-signing-key-for-api-integration-tests")
    );

    private const int JWTExpiryHours = 1;

    /// <summary>
    /// Adds a user directly to the database. Does not assign a password.
    /// </summary>
    /// <param name="userId">The user's ID</param>
    /// <param name="email">The user's email</param>
    public static void AddUserToDbContext(
        AppDbContext database, string userId, string email
    )
    {
        database.Users.Add(
            new IdentityUser
            {
                Id = userId,
                UserName = email,
                NormalizedUserName = email.ToUpperInvariant(),
                Email = email,
                NormalizedEmail = email.ToUpperInvariant(),
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            }
        );
    }

    /// <summary>
    /// Creates a user through a UserManager with the given name and password.
    /// </summary>
    /// <param name="userManager">
    ///     The user manager the user will be added to
    /// </param>
    /// <param name="email">The user's email</param>
    /// <param name="password">The user's password</param>
    /// <returns>The IdentityUser added to the user manager</returns>
    public static async Task<IdentityUser> AddUserThroughUserManagerAsync(
        UserManager<IdentityUser> userManager, string email, string password)
    {
        var user = new IdentityUser
        {
            UserName = email,
            Email = email
        };
        await userManager.CreateAsync(user, password);
        return user;
    }

    /// <summary>
    /// Sets an access token on an HTTP client for a user.
    /// </summary>
    /// <param name="user">The user that needs access</param>
    /// <param name="client">The HTTP client</param>
    public static void SetAccessToken(IdentityUser user, HttpClient client)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
        };
        var credentials = new SigningCredentials(
            TestSigningKey,
            SecurityAlgorithms.HmacSha256
        );
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(JWTExpiryHours),
            signingCredentials: credentials);
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme, tokenString
            );
    }
}
