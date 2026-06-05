using AaronsToDoApp.API.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

const string ConnectionStringKey = "AaronsToDoApp";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

#region Database

var connectionString = builder.Configuration
    .GetConnectionString(ConnectionStringKey)
    ?? throw new InvalidOperationException(
        $"Missing connection string: '{ConnectionStringKey}'"
    );
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
);

#endregion Database

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
