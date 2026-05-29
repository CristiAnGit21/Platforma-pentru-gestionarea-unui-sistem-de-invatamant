using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Subject;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectController : ControllerBase
{
    private readonly ISubjectLogic _subjectLogic;

    public SubjectController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _subjectLogic = bl.SubjectLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        var result = _subjectLogic.GetSubjectList();
        return result.IsSuccess ? Ok(result) : StatusCode(StatusCodes.Status500InternalServerError, result);
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _subjectLogic.GetSubjectById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Create([FromBody] SubjectCreateDto dto)
    {
        var result = _subjectLogic.CreateSubject(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Update(Guid id, [FromBody] SubjectInfoDto dto)
    {
        var result = _subjectLogic.UpdateSubject(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _subjectLogic.DeleteSubject(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}
