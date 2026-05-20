using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Group;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroupController : ControllerBase
{
    private readonly IGroupLogic _groupLogic;

    public GroupController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _groupLogic = bl.GroupLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll() => Ok(_groupLogic.GetGroupList());

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _groupLogic.GetGroupById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Create([FromBody] GroupCreateDto dto)
    {
        var result = _groupLogic.CreateGroup(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Update(Guid id, [FromBody] GroupInfoDto dto)
    {
        var result = _groupLogic.UpdateGroup(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _groupLogic.DeleteGroup(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}