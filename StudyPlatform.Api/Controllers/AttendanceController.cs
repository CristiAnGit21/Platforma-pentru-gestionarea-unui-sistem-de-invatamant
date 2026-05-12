using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Attendance;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceLogic _attendanceLogic;

    public AttendanceController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _attendanceLogic = bl.AttendanceLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll() => Ok(_attendanceLogic.GetAttendanceList());

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _attendanceLogic.GetAttendanceById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpGet("student/{studentId}")]
    [Authorize]
    public IActionResult GetByStudent(Guid studentId) => Ok(_attendanceLogic.GetAttendanceByStudent(studentId));

    [HttpPost]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Create([FromBody] AttendanceCreateDto dto)
    {
        var result = _attendanceLogic.CreateAttendance(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult Update(Guid id, [FromBody] AttendanceInfoDto dto)
    {
        var result = _attendanceLogic.UpdateAttendance(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _attendanceLogic.DeleteAttendance(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}