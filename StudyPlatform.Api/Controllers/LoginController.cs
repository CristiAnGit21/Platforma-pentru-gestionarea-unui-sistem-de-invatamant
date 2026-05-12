using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.Domain.Entities.User;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly BusinessLayer.Interfaces.ISession _session;

    public LoginController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _session = bl.GetSessionBL();
    }

    [HttpPost]
    [AllowAnonymous]
    public IActionResult Login([FromBody] UserLoginDto dto)
    {
        var data = new ULoginData
        {
            Credential = dto.Credential,
            Password = dto.Password,
            LoginIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
            LoginDateTime = DateTime.UtcNow
        };

        var result = _session.UserLogin(data);

        if (!result.Status)
            return Unauthorized(result);

        var cookieValue = _session.GenCookieValue(dto.Credential);
        Response.Cookies.Append("X-KEY", cookieValue, new CookieOptions
        {
            Expires = DateTimeOffset.UtcNow.AddMinutes(60),
            HttpOnly = true,
            SameSite = SameSiteMode.Lax
        });

        return Ok(result);
    }
}
