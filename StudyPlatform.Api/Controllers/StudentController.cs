using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Student;

namespace studyplatform.API.Controllers;

[ApiController]
[Route("api/students")]
public class StudentController: ControllerBase
{
    private readonly IStudentLogic _studentLogic;

    public StudentController()
    {
        var bl = new BusinessLogic();
        _studentLogic = bl.GetStudentLogic();
    }

    [HttpGet]
    public IActionResult GetStudents()
    {
        var response = _studentLogic.GetStudentList();
        if (!response.IsSuccess)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetStudentById(int id)
    {
        var response = _studentLogic.GetStudentById(id);
        if (!response.IsSuccess)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpPost]
    public IActionResult CreateStudent([FromBody] StudentCreateDto studentCreateDto)
    {
        var response = _studentLogic.CreateStudent(studentCreateDto);
        if (!response.IsSuccess)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateStudent(int id, [FromBody] StudentCreateDto studentCreateDto)
    {
        var response = _studentLogic.UpdateStudent(id, studentCreateDto);
        if (!response.IsSuccess)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public IActionResult DeleteStudent(int id)
    {
        var response = _studentLogic.DeleteStudent(id);
        if (!response.IsSuccess)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}
