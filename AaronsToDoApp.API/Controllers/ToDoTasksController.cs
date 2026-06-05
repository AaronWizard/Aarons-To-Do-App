using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AaronsToDoApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ToDoTasksController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok("Got all tasks");
    }
}
