namespace AaronsToDoApp.API.Options;

public class AuthenticationOptions
{
    public const string Key = "Authentication";

    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public required string SecurityKey { get; set; }

    public required int AccessTokenLifetimeMinutes { get; set; }
    public required int RefreshTokenLifetimeHours { get; set; }

    public required int ClockSkewMinutes { get; set; }
}
