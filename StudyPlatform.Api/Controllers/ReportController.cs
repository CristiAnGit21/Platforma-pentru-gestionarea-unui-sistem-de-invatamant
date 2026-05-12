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
    [Authorize(Roles = "ADMIN,PROFESOR")]
    public IActionResult GetAll() => Ok(_reportLogic.GetReportList());

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
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}