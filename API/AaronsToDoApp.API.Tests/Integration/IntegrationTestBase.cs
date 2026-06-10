using AaronsToDoApp.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace AaronsToDoApp.API.Tests.Integration;

public abstract class IntegrationTestBase : IDisposable
{
    // In-memory DB
    private const string ConnectionString = "DataSource=:memory:";
    private readonly SqliteConnection _connection = new SqliteConnection(
        ConnectionString
    );

    protected readonly AppDbContext DbContext;

    protected IntegrationTestBase()
    {
        // Keep connection open. Closing it destroys the in-memory DB.
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
}
