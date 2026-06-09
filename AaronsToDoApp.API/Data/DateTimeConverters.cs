using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AaronsToDoApp.API.Data;

// Ensure datetimes read from SQLite are formatted as UTC.
// See https://learn.microsoft.com/en-us/ef/core/providers/sqlite/limitations#query-limitations
public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter() : base(
        // Leave as-is when saving to SQLite
        toDb => toDb,
        // Force UTC when reading
        fromDb => DateTime.SpecifyKind(fromDb, DateTimeKind.Utc)
    )
    { }
}

public class NullableUtcDateTimeConverter : ValueConverter<DateTime?, DateTime?>
{
    public NullableUtcDateTimeConverter() : base(
        // Leave as-is when saving to SQLite
        toDb => toDb,
        // Force UTC when reading
        fromDb => fromDb.HasValue ?
            DateTime.SpecifyKind(fromDb.Value, DateTimeKind.Utc)
            : null
    )
    { }
}
