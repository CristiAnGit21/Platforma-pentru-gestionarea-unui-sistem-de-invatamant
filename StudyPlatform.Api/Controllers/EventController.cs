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
    public IActionResult GetAll() => Ok(_eventLogic.GetEventList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _eventLogic.GetEventById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public IActionResult Create([FromBody] EventCreateDto dto)
    {
        var result = _eventLogic.CreateEvent(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] EventInfoDto dto)
    {
        var result = _eventLogic.UpdateEvent(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _eventLogic.DeleteEvent(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}