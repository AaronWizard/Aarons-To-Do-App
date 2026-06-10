using AaronsToDoApp.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace AaronsToDoApp.API.Tests.Integration;

public abstract class IntegrationTestBase : IDisposable
{
    // In-memory DB
    private const string ConnectionString = "DataSource=:memory:";

    private readonly SqliteConnection _connection;
    protected readonly AppDbContext DbContext;

    protected IntegrationTestBase()
    {
        // Keep connection open. Closing it destroys the in-memory DB.
        _connection = new SqliteConnection(ConnectionString);
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        DbContext = new AppDbContext(options);
        DbContext.Database.EnsureCreated(); // Creates schema from model
    }

    public void Dispose()
    {
        DbContext.Dispose();
        _connection.Dispose();
    }

    /// <summary>
    /// Adds a user to the database, configuring it with the additional
    /// properties necessary for an IdentityUser.
    /// </summary>
    /// <param name="userId">The user's ID</param>
    /// <param name="email">The user's email</param>
    public void AddUserToDbContext(string userId, string email)
    {
        DbContext.Users.Add(
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
}
