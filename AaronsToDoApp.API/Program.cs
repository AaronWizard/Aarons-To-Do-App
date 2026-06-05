using System.Text;
using AaronsToDoApp;
using AaronsToDoApp.API.Data;
using AaronsToDoApp.API.Options;
using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

#region Authentication

var authenticationSection = builder.Configuration.GetSection(
    AuthenticationOptions.Key
);
var authenticationOptions = authenticationSection.Get<AuthenticationOptions>()
    ?? throw new InvalidOperationException(
        $"Missing {AuthenticationOptions.Key} configuration section"
    );
builder.Services.Configure<AuthenticationOptions>(authenticationSection);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = authenticationOptions.Issuer,
        ValidAudience = authenticationOptions.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(authenticationOptions.SecurityKey)
        )
    };
});

#endregion

builder.Services.AddScoped<AuthTokensService>();
builder.Services.AddScoped<UsersService>();

builder.Services.AddDataProtection();
builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.AddPreferredSecuritySchemes(
            JwtBearerDefaults.AuthenticationScheme
        );
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
