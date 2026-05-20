using Microsoft.AspNetCore.Authorization;
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

    public UserController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _userLogic = bl.UserLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll() => Ok(_userLogic.GetUserList());

    [HttpPost("register")]
    [AllowAnonymous]
    public IActionResult Register([FromBody] UserCreateDto dto)
    {
        var result = _userLogic.RegisterUser(dto);
        return result.Status ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    [AllowAnonymous]
    public IActionResult Create([FromBody] UserCreateDto dto)
    {
        var result = _userLogic.CreateUser(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _userLogic.DeleteUser(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _userLogic.GetUserById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Update(Guid id, [FromBody] UserInfoDto dto)
    {
        var result = _userLogic.UpdateUser(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("role/{role}")]
    [Authorize]
    public IActionResult GetByRole(UserRole role) => Ok(_userLogic.GetUsersByRole(role));

    [HttpGet("group/{groupId}")]
    [Authorize]
    public IActionResult GetByGroup(Guid groupId) => Ok(_userLogic.GetUsersByGroup(groupId));
}