using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.Domain.Models.Report;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportLogic _reportLogic;

    public ReportController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _reportLogic = bl.ReportLogic();
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        if (User.IsInRole("ADMIN") || User.IsInRole("PROFESOR"))
            return Ok(_reportLogic.GetReportList());

        var callerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        return Ok(_reportLogic.GetReportsByUser(callerId));
    }

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetById(Guid id)
    {
        var result = _reportLogic.GetReportById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    [Authorize]
    public IActionResult Create([FromBody] ReportCreateDto dto)
    {
        var callerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        dto.UserId = callerId == Guid.Empty ? null : callerId;

        var result = _reportLogic.CreateReport(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Update(Guid id, [FromBody] ReportInfoDto dto)
    {
        var result = _reportLogic.UpdateReport(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _reportLogic.DeleteReport(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}