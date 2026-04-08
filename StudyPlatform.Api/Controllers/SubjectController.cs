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
    public IActionResult GetAll() => Ok(_subjectLogic.GetSubjectList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _subjectLogic.GetSubjectById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public IActionResult Create([FromBody] SubjectCreateDto dto)
    {
        var result = _subjectLogic.CreateSubject(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] SubjectInfoDto dto)
    {
        var result = _subjectLogic.UpdateSubject(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _subjectLogic.DeleteSubject(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}