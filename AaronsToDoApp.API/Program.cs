using AaronsToDoApp.API.Data;
using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

const string ConnectionStringKey = "AaronsToDoApp";
const string PasswordKey = "Password";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

#region Database

var connectionString =
    builder.Configuration.GetConnectionString(ConnectionStringKey)
    ?? throw new InvalidOperationException(
        $"Missing connection string: '{ConnectionStringKey}'"
    );

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
);

#endregion Database

#region Identity

builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;

    var passwordConfig = builder.Configuration.GetSection(PasswordKey)
        ?? throw new InvalidOperationException(
            $"Missing configuration section: '{PasswordKey}'"
        );
    passwordConfig.Bind(options.Password);
});

builder.Services
    .AddIdentityCore<IdentityUser>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

#endregion Identity

builder.Services.AddScoped<UsersService>();

builder.Services.AddDataProtection();
builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
