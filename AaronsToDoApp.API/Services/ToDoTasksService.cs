using AaronsToDoApp.API.Data;
using AaronsToDoApp.API.DTOs;
using AaronsToDoApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AaronsToDoApp.API.Services;

public class ToDoTasksService(AppDbContext database)
{
    private const int MaxPageSize = 100;

    public async Task<PagedDto<ToDoTaskDto>> GetTaskListAsync(
        string userId, int page = 1, int pageSize = 20
    )
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

        var query = database.ToDoTasks
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedUTC);

        var totalTasks = await query.CountAsync();
        var taskDtos = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => CreateTaskDto(t))
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(totalTasks / (double)pageSize);

        return new(
            Items: taskDtos,
            Page: page,
            PageSize: pageSize,
            TotalPages: totalPages
        );
    }

    public async Task<ToDoTaskDto?> GetTaskAsync(string userId, int taskId)
    {
        var task = await database.ToDoTasks
            .FirstOrDefaultAsync(t => (t.Id == taskId) && (t.UserId == userId));
        if (task == null)
        {
            return null;
        }
        return CreateTaskDto(task);
    }

    public async Task<ToDoTaskDto> CreateTaskAsync(
        string userId, CreateToDoTaskRequestDto taskRequest
    )
    {
        var task = new ToDoTask
        {
            UserId = userId,
            Name = taskRequest.Name,
            Description = taskRequest.Description,
            DeadlineUTC = taskRequest.DeadlineUTC?.UtcDateTime,
            CreatedUTC = DateTime.UtcNow
        };

        database.ToDoTasks.Add(task);
        await database.SaveChangesAsync();

        return CreateTaskDto(task);
    }

    public async Task<ToDoTaskDto?> UpdateTaskAsync(
        string userId, int taskId, UpdateToDoTaskRequest taskRequest
    )
    {
        var task = await database.ToDoTasks.FirstOrDefaultAsync(
            t => (t.Id == taskId) && (t.UserId == userId));
        if (task == null)
        {
            return null;
        }

        task.Name = taskRequest.Name;
        task.Description = taskRequest.Description;
        task.DeadlineUTC = taskRequest.DeadlineUTC?.UtcDateTime;
        task.CompletedUTC = taskRequest.CompletedUTC?.UtcDateTime;

        await database.SaveChangesAsync();

        return CreateTaskDto(task);
    }

    public async Task<bool> DeleteTaskAsync(string userId, int taskId)
    {
        var task = await database.ToDoTasks
            .FirstOrDefaultAsync(t => (t.Id == taskId) && (t.UserId == userId));
        if (task == null)
        {
            return false;
        }

        database.ToDoTasks.Remove(task);
        await database.SaveChangesAsync();

        return true;
    }

    private static ToDoTaskDto CreateTaskDto(ToDoTask task) => new(
        Id: task.Id,
        Name: task.Name,
        CreatedUTC: task.CreatedUTC,
        CompletedUTC: task.CompletedUTC,
        DeadlineUTC: task.DeadlineUTC,
        Description: task.Description
    );
}
