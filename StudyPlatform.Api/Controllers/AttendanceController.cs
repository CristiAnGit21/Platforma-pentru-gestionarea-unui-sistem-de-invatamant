using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Attendance;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceLogic _attendanceLogic;

    public AttendanceController(IAttendanceLogic attendanceLogic)
    {
        _attendanceLogic = attendanceLogic;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_attendanceLogic.GetAttendanceList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _attendanceLogic.GetAttendanceById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpGet("student/{studentId}")]
    public IActionResult GetByStudent(Guid studentId) => Ok(_attendanceLogic.GetAttendanceByStudent(studentId));

    [HttpPost]
    public IActionResult Create([FromBody] AttendanceCreateDto dto)
    {
        var result = _attendanceLogic.CreateAttendance(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] AttendanceInfoDto dto)
    {
        var result = _attendanceLogic.UpdateAttendance(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _attendanceLogic.DeleteAttendance(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}