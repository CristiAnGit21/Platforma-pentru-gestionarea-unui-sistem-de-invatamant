using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Grade;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeController : ControllerBase
{
    private readonly IGradeLogic _gradeLogic;

    public GradeController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _gradeLogic = bl.GradeLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll() => Ok(_gradeLogic.GetGradeList());

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _gradeLogic.GetGradeById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpGet("student/{studentId}")]
    [Authorize]
    public IActionResult GetByStudent(Guid studentId)
    {
        var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (User.IsInRole("STUDENT") && callerId != studentId.ToString())
            return Forbid();
        return Ok(_gradeLogic.GetGradesByStudent(studentId));
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Create([FromBody] GradeCreateDto dto)
    {
        var result = _gradeLogic.CreateGrade(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Update(Guid id, [FromBody] GradeInfoDto dto)
    {
        var result = _gradeLogic.UpdateGrade(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Delete(Guid id)
    {
        var result = _gradeLogic.DeleteGrade(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}
