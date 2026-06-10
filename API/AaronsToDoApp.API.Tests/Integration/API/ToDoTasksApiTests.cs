using System.Net;
using System.Net.Http.Json;
using AaronsToDoApp.API.Data;
using AaronsToDoApp.API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AaronsToDoApp.API.Tests.Integration.API;

public class ToDoTasksApiTests : IAsyncLifetime
{
    private APIIntegrationTestFactory _factory = null!;
    private HttpClient _client = null!;

    private const string UserEmail = "test@example.com";
    private const string UserPassword = "Password1!";

    private const string ToDoTaskEndpoint = "/api/todotasks";

    public async Task InitializeAsync()
    {
        _factory = new APIIntegrationTestFactory();
        _client = _factory.CreateClient();

        using var scope = _factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        database.Database.EnsureCreated();

        var userManager = scope.ServiceProvider
            .GetRequiredService<UserManager<IdentityUser>>();
        var user = await IntegrationTestHelpers.AddUserThroughUserManagerAsync(
            userManager, UserEmail, UserPassword
        );
        IntegrationTestHelpers.SetAccessToken(user, _client);
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _factory.DisposeAsync();
    }

    [Fact]
    public async Task CreateToDoTask_ValidTask_Succeeds()
    {
        using var scope = _factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var taskInDB = await database.ToDoTasks.FirstOrDefaultAsync();
        Assert.Null(taskInDB);

        var createTaskDto = new CreateToDoTaskRequestDto
        {
            Name = "Test Task",
            Description = "A test task"
        };

        var response = await _client.PostAsJsonAsync(
            ToDoTaskEndpoint, createTaskDto
        );

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var resultTaskDto = await response.Content
            .ReadFromJsonAsync<ToDoTaskDto>();
        Assert.NotNull(resultTaskDto);
        Assert.Equal(createTaskDto.Name, resultTaskDto.Name);
        Assert.Equal(createTaskDto.Description, resultTaskDto.Description);
        Assert.Equal(createTaskDto.DeadlineUTC, resultTaskDto.DeadlineUTC);

        taskInDB = await database.ToDoTasks.FirstOrDefaultAsync();
        Assert.NotNull(taskInDB);
        Assert.Equal(resultTaskDto.Id, taskInDB.Id);
        Assert.Equal(resultTaskDto.Name, resultTaskDto.Name);
        Assert.Equal(resultTaskDto.Description, resultTaskDto.Description);
        Assert.Equal(resultTaskDto.DeadlineUTC, resultTaskDto.DeadlineUTC);
    }

    [Fact]
    public async Task CreateToDoTask_InvalidTask_Fails()
    {
        using var scope = _factory.Services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var taskInDB = await database.ToDoTasks.FirstOrDefaultAsync();
        Assert.Null(taskInDB);

        var createTaskDto = new CreateToDoTaskRequestDto
        {
            Name = string.Empty,
            Description = "A test task"
        };

        var response = await _client.PostAsJsonAsync(
            ToDoTaskEndpoint, createTaskDto
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        taskInDB = await database.ToDoTasks.FirstOrDefaultAsync();
        Assert.Null(taskInDB);
    }
}
