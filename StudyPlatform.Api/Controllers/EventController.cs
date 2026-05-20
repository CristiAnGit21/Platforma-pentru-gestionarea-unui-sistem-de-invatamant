using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Event;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventLogic _eventLogic;

    public EventController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _eventLogic = bl.EventLogic();
    }
    [HttpGet]
    [Authorize]
    public IActionResult GetAll() => Ok(_eventLogic.GetEventList());

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _eventLogic.GetEventById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Create([FromBody] EventCreateDto dto)
    {
        var result = _eventLogic.CreateEvent(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Update(Guid id, [FromBody] EventInfoDto dto)
    {
        var result = _eventLogic.UpdateEvent(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _eventLogic.DeleteEvent(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}