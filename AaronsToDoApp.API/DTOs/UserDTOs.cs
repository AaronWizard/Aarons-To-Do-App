namespace AaronsToDoApp.API.DTOs;

public record RegisterDto(string Email, string Password);
public record LoginDto(string Email, string Password);

public record UserInfoDto(string Email);
