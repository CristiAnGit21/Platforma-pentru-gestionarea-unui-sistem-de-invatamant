using Microsoft.AspNetCore.Mvc;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities.Admin;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly PlatformDbContext _context;

    public AdminController(PlatformDbContext context)
    {
        _context = context;
    }

    // CREATE: Adaugă un admin nou
    [HttpPost]
    public IActionResult CreateAdmin([FromBody] AdminInfoDto admin)
    {
        _context.Admins.Add(admin);
        _context.SaveChanges();
        return Ok(admin);
    }

    // READ: Vezi toți adminii
    [HttpGet]
    public IActionResult GetAllAdmins()
    {
        var admins = _context.Admins.ToList();
        return Ok(admins);
    }

    // UPDATE: Modifică un admin
    [HttpPut("{id}")]
    public IActionResult UpdateAdmin(Guid id, [FromBody] AdminInfoDto updatedAdmin)
    {
        var admin = _context.Admins.Find(id);
        if (admin == null) return NotFound();

        admin.FullName = updatedAdmin.FullName;
        admin.Email = updatedAdmin.Email;

        _context.SaveChanges();
        return Ok(admin);
    }

    // DELETE: Șterge un admin
    [HttpDelete("{id}")]
    public IActionResult DeleteAdmin(Guid id)
    {
        var admin = _context.Admins.Find(id);
        if (admin == null) return NotFound();

        _context.Admins.Remove(admin);
        _context.SaveChanges();
        return Ok(new { message = "Admin șters cu succes" });
    }
}