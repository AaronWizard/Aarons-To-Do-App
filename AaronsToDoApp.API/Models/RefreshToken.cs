using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;

namespace AaronsToDoApp.API.Models;

public class RefreshToken
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Token { get; set; }
    public DateTime CreatedUTC { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresUTC { get; set; }
    public DateTime? RevokedUTC { get; set; }

    public IdentityUser? User { get; set; }

    public bool IsActive
        => (ExpiresUTC > DateTime.UtcNow) && (RevokedUTC == null);
}
