using System.Security.Claims;
using System.Text.Encodings.Web;
using BlogAppApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace BlogAppApi.Authentication;

public class IdentityHubAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public IdentityHubAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var authorization = Request.Headers.Authorization.ToString();
        if (!authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            return AuthenticateResult.NoResult();

        var token = authorization["Bearer ".Length..].Trim();
        if (string.IsNullOrEmpty(token))
            return AuthenticateResult.Fail("A bearer token is required.");

        var jwtService = Context.RequestServices.GetRequiredService<IJwtService>();
        try
        {
            if (!await jwtService.ValidateTokenAsync(token, Context.RequestAborted))
                return AuthenticateResult.Fail("The access token is invalid or inactive.");

            var userId = await jwtService.GetUserIdAsync(token, Context.RequestAborted);
            if (userId is null)
                return AuthenticateResult.Fail("The access token is not associated with a BlogApp user.");

            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString())
            }, Scheme.Name);
            return AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name));
        }
        catch (HttpRequestException exception)
        {
            Logger.LogWarning(exception, "Identity Hub could not be reached while validating a bearer token.");
            return AuthenticateResult.Fail("Identity Hub is unavailable.");
        }
    }
}
