using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AaronsToDoApp.API.DTOs;
using AaronsToDoApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AaronsToDoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ToDoTasksController(ToDoTasksService tasksService) : ControllerBase
{
    [HttpGet]
    public async Task<PagedDto<ToDoTaskDto>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20
    )
    {
        var userId = GetUserId();
        var pagedTasks = await tasksService.GetTaskListAsync(
            userId, page, pageSize);
        return pagedTasks;
    }

    [HttpGet("{taskId:int}")]
    [ProducesResponseType(typeof(ToDoTaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ToDoTaskDto>> GetTask(int taskId)
    {
        var userId = GetUserId();
        var taskDto = await tasksService.GetTaskAsync(userId, taskId);
        if (taskDto == null)
        {
            return NotFound();
        }
        else
        {
            return taskDto;
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(ToDoTaskDto), StatusCodes.Status201Created)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ToDoTaskDto>> CreateTask(
        [FromBody] CreateToDoTaskRequestDto request)
    {
        var userId = GetUserId();
        var taskDto = await tasksService.CreateTaskAsync(userId, request);
        return CreatedAtAction(
            nameof(GetTask),
            new { taskId = taskDto.Id },
            taskDto
        );
    }

    [HttpPut("{taskId:int}")]
    [ProducesResponseType(typeof(ToDoTaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ToDoTaskDto>> UpdateTask(
        int taskId, [FromBody] UpdateToDoTaskRequest request)
    {
        var userId = GetUserId();
        var taskDto = await tasksService.UpdateTaskAsync(
            userId, taskId, request);
        if (taskDto == null)
        {
            return NotFound();
        }
        else
        {
            return taskDto;
        }
    }

    [HttpDelete("{taskId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var userId = GetUserId();
        var deleted = await tasksService.DeleteTaskAsync(userId, taskId);
        if (deleted)
        {
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }

    private string GetUserId() =>
        User.FindFirstValue(JwtRegisteredClaimNames.Sub)!;
}
