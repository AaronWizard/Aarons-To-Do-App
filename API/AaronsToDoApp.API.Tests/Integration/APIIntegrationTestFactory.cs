using System.Text;
using AaronsToDoApp.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace AaronsToDoApp.API.Tests.Integration;

public class APIIntegrationTestFactory : WebApplicationFactory<Program>
{
    // In-memory DB
    private const string ConnectionString = "DataSource=:memory:";
    private readonly SqliteConnection _connection = new(ConnectionString);

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove application database.
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>)
            );
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Keep connection open. Closing it destroys the in-memory DB.
            _connection.Open();

            // Replace application database with in-memory SQLite database.
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(_connection));

            // Override JWT validation to use test key
            services.PostConfigure<JwtBearerOptions>(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    options.TokenValidationParameters.IssuerSigningKey
                        = IntegrationTestHelpers.TestSigningKey;
                    options.TokenValidationParameters.ValidateIssuer = false;
                    options.TokenValidationParameters.ValidateAudience = false;
                }
            );
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        _connection.Close();
    }
}
