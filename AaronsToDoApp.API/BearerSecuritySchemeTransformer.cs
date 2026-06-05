using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace AaronsToDoApp;

class BearerSecuritySchemeTransformer(
    IAuthenticationSchemeProvider authSchemeProvider)
    : IOpenApiDocumentTransformer
{
    private const string BearerScheme = "bearer";
    private const string JwtBearerFormat = "JWT";

    public async Task TransformAsync(
        OpenApiDocument document,
        OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken
    )
    {
        var authSchemes = await authSchemeProvider.GetAllSchemesAsync();
        if (!authSchemes.Any(s =>
            s.Name == JwtBearerDefaults.AuthenticationScheme
        ))
        {
            return;
        }

        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??=
            new Dictionary<string, IOpenApiSecurityScheme>();
        document.Components
            .SecuritySchemes[JwtBearerDefaults.AuthenticationScheme]
            = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = BearerScheme,
                In = ParameterLocation.Header,
                BearerFormat = JwtBearerFormat
            };
    }
}
