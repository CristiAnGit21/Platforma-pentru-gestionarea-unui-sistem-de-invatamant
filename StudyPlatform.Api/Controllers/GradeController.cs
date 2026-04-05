using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Grade;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeController : ControllerBase
{
    private readonly IGradeLogic _gradeLogic;

    public GradeController(IGradeLogic gradeLogic)
    {
        _gradeLogic = gradeLogic;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_gradeLogic.GetGradeList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _gradeLogic.GetGradeById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpGet("student/{studentId}")]
    public IActionResult GetByStudent(Guid studentId) => Ok(_gradeLogic.GetGradesByStudent(studentId));

    [HttpPost]
    public IActionResult Create([FromBody] GradeCreateDto dto)
    {
        var result = _gradeLogic.CreateGrade(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] GradeInfoDto dto)
    {
        var result = _gradeLogic.UpdateGrade(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _gradeLogic.DeleteGrade(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}