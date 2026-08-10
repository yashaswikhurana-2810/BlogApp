using System.Security.Claims;
using System.Text.Encodings.Web;
using BlogAppApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace BlogAppApi.Authentication;

public class IdentityHubAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public IdentityHubAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        UrlEncoder encoder)
        : base(options, NullLoggerFactory.Instance, encoder)
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
            if (!await jwtService.ValidateTokenAsync(token))
                return AuthenticateResult.Fail("The access token is invalid or inactive.");

            var userId = await jwtService.GetUserIdAsync(token);
            if (userId is null)
                return AuthenticateResult.Fail("The access token is not associated with a BlogApp user.");

            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString())
            }, Scheme.Name);
            return AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name));
        }
        catch (HttpRequestException)
        {
            return AuthenticateResult.Fail("Identity Hub is unavailable.");
        }
    }
}
