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
    public IActionResult GetAll() => Ok(_reportLogic.GetReportList());

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var result = _reportLogic.GetReportById(id);
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public IActionResult Create([FromBody] ReportCreateDto dto)
    {
        var result = _reportLogic.CreateReport(dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public IActionResult Update(Guid id, [FromBody] ReportInfoDto dto)
    {
        var result = _reportLogic.UpdateReport(id, dto);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var result = _reportLogic.DeleteReport(id);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }
}