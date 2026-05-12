using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace studyplatform.API.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet("check")]
    [AllowAnonymous]
    public IActionResult Check()
    {
        return Ok("Server is up and running");
    }
}