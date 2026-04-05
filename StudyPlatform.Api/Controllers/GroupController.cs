using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Group;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
    private readonly IGroupLogic _groupLogic;

    public GroupController(IGroupLogic groupLogic)
    {
        _groupLogic = groupLogic;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_groupLogic.GetGroupList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _groupLogic.GetGroupById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public IActionResult Create([FromBody] GroupCreateDto dto)
    {
        var result = _groupLogic.CreateGroup(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] GroupInfoDto dto)
    {
        var result = _groupLogic.UpdateGroup(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _groupLogic.DeleteGroup(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}