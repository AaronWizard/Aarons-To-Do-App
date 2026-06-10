using AaronsToDoApp.API.DTOs;
using AaronsToDoApp.API.Models;
using AaronsToDoApp.API.Services;

namespace AaronsToDoApp.API.Tests.Integration.Services;

public class ToDoTasksServiceTests : IntegrationTestBase
{
    #region Test Data

    private record TestData(
        string userId, string userEmail, IEnumerable<ToDoTask> tasks
    );

    private const string UserID_A = "user-a";
    private TestData UserA = new(
        userId: UserID_A,
        userEmail: "user_a@example.com",
        tasks: new List<ToDoTask>
        {
            new ToDoTask { Id = 1, UserId = UserID_A, Name = "A - Task 1" },
            new ToDoTask { Id = 2, UserId = UserID_A, Name = "A - Task 2" },
            new ToDoTask { Id = 3, UserId = UserID_A, Name = "A - Task 3" }
        }
    );

    private const string UserID_B = "user-b";
    private TestData UserB = new(
        userId: UserID_B,
        userEmail: "user_b@example.com",
        tasks: new List<ToDoTask>
        {
            new ToDoTask { Id = 4, UserId = UserID_B, Name = "A - Task 1" },
            new ToDoTask { Id = 5, UserId = UserID_B, Name = "A - Task 2" },
            new ToDoTask { Id = 6, UserId = UserID_B, Name = "A - Task 3" }
        }
    );

    #endregion Test Data

    private readonly ToDoTasksService _service;

    public ToDoTasksServiceTests()
    {
        // Seed test data
        AddUserToDbContext(UserA.userId, UserA.userEmail);
        DbContext.ToDoTasks.AddRange(UserA.tasks);

        AddUserToDbContext(UserB.userId, UserB.userEmail);
        DbContext.ToDoTasks.AddRange(UserB.tasks);

        DbContext.SaveChanges();

        // Clear the tracker so reads don't hit the cache.
        // Simulates real app behavior.
        DbContext.ChangeTracker.Clear();

        _service = new ToDoTasksService(DbContext);
    }

    [Fact]
    public async Task GetTaskListAsync_ReturnsOnlyTasksBelongingToUser()
    {
        var page = 1;
        var pageSize = UserA.tasks.Count();

        var taskPage = await _service.GetTaskListAsync(
            UserA.userId, page, pageSize
        );

        Assert.Equal(UserA.tasks.Count(), taskPage.Items.Count());

        // Should only see tasks belonging to user A.
        Assert.All(
            taskPage.Items,
            task => Assert.Single(UserA.tasks, ta => ta.Id == task.Id)
        );

        // Should not see tasks belonging to user B.
        Assert.All(
            taskPage.Items,
            task => Assert.DoesNotContain(UserB.tasks, tb => tb.Id == task.Id)
        );
    }

    [Fact]
    public async Task UpdateTaskAsync_WithTaskBelongingToOtherUser_ReturnsNull()
    {
        var userBTask = UserB.tasks.First();
        var userBTaskOldName = userBTask.Name;

        var newName = "Hijacked";

        var updatedTask = await _service.UpdateTaskAsync(
            UserA.userId,
            userBTask.Id,
            new UpdateToDoTaskRequest { Name = newName }
        );

        // Task belongs to User B. User A should not be able to update it.

        Assert.Null(updatedTask);

        var oldTask = await _service.GetTaskAsync(UserB.userId, userBTask.Id);
        Assert.NotNull(oldTask);
        Assert.Equal(userBTaskOldName, oldTask.Name);
    }
}
