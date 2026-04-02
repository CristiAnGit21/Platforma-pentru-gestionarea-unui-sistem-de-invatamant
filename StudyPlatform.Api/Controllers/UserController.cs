using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
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
    public IActionResult Create([FromBody] UserInfoDto dto)
    {
        var result = _userLogic.CreateUser(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id) => Ok(_userLogic.DeleteUser(id));
}