namespace AaronsToDoApp.API.Models;

class ToDoTask
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedUTC { get; set; }
    public DateTime? CompletedUTC { get; set; }

    public DateTime? DeadlineUTC { get; set; }
    public string? Description { get; set; }
}
