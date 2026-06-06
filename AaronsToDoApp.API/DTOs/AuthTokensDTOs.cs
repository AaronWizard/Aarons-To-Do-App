namespace AaronsToDoApp.API.DTOs;

public record AuthTokensDto(string AccessToken, string RefreshToken);
public record RefreshTokenDto(string RefreshToken);
