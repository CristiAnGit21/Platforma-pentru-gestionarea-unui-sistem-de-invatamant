using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserLogic _userLogic;

    public UserController(IUserLogic userLogic)
    {
        _userLogic = userLogic;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_userLogic.GetUserList());

    [HttpPost]
    public IActionResult Create([FromBody] UserCreateDto dto) // SCHIMBAT: Folosim UserCreateDto
    {
        var result = _userLogic.CreateUser(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _userLogic.DeleteUser(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _userLogic.GetUserById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] UserInfoDto dto)
    {
        var result = _userLogic.UpdateUser(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("role/{role}")]
    public IActionResult GetByRole(UserRole role) => Ok(_userLogic.GetUsersByRole(role));
}