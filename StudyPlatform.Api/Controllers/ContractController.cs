using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyPlatform.BusinessLayer.Interfaces;
using System.Security.Claims;

namespace StudyPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractController : ControllerBase
{
    private readonly IContractLogic _logic;

    public ContractController()
    {
        var bl = new BusinessLayer.BusinessLogic();
        _logic = bl.ContractLogic();
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [RequestSizeLimit(20 * 1024 * 1024)] // 20 MB
    public async Task<IActionResult> Upload([FromForm] Guid studentId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Fișierul este obligatoriu." });
        if (!file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Doar fișiere PDF sunt acceptate." });

        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var data = ms.ToArray();

        var result = _logic.Upload(studentId, file.FileName, data, adminId);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet("student/{studentId}")]
    [Authorize]
    public IActionResult GetByStudent(Guid studentId)
    {
        var callerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var isAdmin = User.IsInRole("ADMIN");

        if (!isAdmin && callerId != studentId)
            return Forbid();

        var result = _logic.GetByStudent(studentId);
        if (!result.IsSuccess)
            return result.IsNotFound ? NotFound(result) : BadRequest(result);
        return Ok(result);
    }

    [HttpGet("{id}/file")]
    [Authorize]
    public IActionResult GetFile(Guid id)
    {
        var (fileName, data) = _logic.GetRawFile(id);
        if (fileName is null || data is null)
            return NotFound(new { message = "Contractul nu a fost găsit." });

        return File(data, "application/pdf", fileName);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(Guid id)
    {
        var result = _logic.Delete(id);
        if (result.IsSuccess) return Ok(result);
        return result.IsNotFound ? NotFound(result) : BadRequest(result);
    }
}
