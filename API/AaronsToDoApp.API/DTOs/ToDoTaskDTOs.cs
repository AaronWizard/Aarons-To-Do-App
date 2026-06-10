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
    DateTimeOffset CreatedUTC,
    DateTimeOffset? CompletedUTC,
    DateTimeOffset? DeadlineUTC,
    string? Description
);

public record CreateToDoTaskRequestDto
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; init; }

    [MaxLength(1000)]
    public string? Description { get; init; }

    public DateTimeOffset? DeadlineUTC { get; init; }
}

public record UpdateToDoTaskRequest
{
    [Required]
    [MaxLength(100)]
    public required string Name { get; init; }

    [MaxLength(1000)]
    public string? Description { get; init; }

    public DateTimeOffset? DeadlineUTC { get; init; }

    public DateTimeOffset? CompletedUTC { get; init; }
}
