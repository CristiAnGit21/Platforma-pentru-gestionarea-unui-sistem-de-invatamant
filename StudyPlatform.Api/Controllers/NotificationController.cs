using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Notification;
using System.Security.Claims;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationLogic _logic;

    public NotificationController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _logic = bl.NotificationLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        var result = _logic.GetAll();
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Create([FromBody] NotificationCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(userIdClaim, out var userId);
        var result = _logic.Create(dto, userId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _logic.Delete(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}
