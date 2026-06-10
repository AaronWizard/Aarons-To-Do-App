using Microsoft.AspNetCore.Identity;

namespace AaronsToDoApp.API.Models;

public class ToDoTask
{
    public int Id { get; set; }
    public required string UserId { get; set; }

    public required string Name { get; set; }
    public DateTime CreatedUTC { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedUTC { get; set; }

    public DateTime? DeadlineUTC { get; set; }
    public string? Description { get; set; }

    public IdentityUser? User { get; set; }
}
