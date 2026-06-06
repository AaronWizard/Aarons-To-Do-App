using System.ComponentModel.DataAnnotations;

namespace AaronsToDoApp.API.DTOs;

public record PagedDto<T>(
    IEnumerable<T> Items,
    int Page,
    int PageSize,
    int TotalPages
);

public record ToDoTaskDto(
    int Id,
    string Name,
    DateTime CreatedUTC,
    DateTime? CompletedUTC,
    DateTime? DeadlineUTC,
    string? Description
);

public record CreateToDoTaskRequestDto
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; init; }

    [MaxLength(1000)]
    public string? Description { get; init; }

    public DateTime? DeadlineUTC { get; init; }
}

public record UpdateToDoTaskRequest
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; init; }

    [MaxLength(1000)]
    public string? Description { get; init; }

    public DateTime? DeadlineUTC { get; init; }

    public DateTime? CompletedUTC { get; init; }
}
