using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Contract;

namespace StudyPlatform.BusinessLayer.Structure;

public class ContractActions
{
    public bool Upload(Guid studentId, string fileName, byte[] fileData, Guid uploadedByUserId)
    {
        using var context = new PlatformDbContext();
        try
        {
            var existing = context.Contracts.FirstOrDefault(c => c.StudentId == studentId);
            if (existing != null)
            {
                existing.FileName = fileName;
                existing.FileData = fileData;
                existing.FileSize = fileData.LongLength;
                existing.UploadedAt = DateTime.UtcNow;
                existing.UploadedByUserId = uploadedByUserId;
            }
            else
            {
                context.Contracts.Add(new ContractEntity
                {
                    StudentId = studentId,
                    FileName = fileName,
                    FileData = fileData,
                    FileSize = fileData.LongLength,
                    UploadedByUserId = uploadedByUserId,
                });
            }
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare upload contract: {ex.Message}"); return false; }
    }

    public ContractInfoDto? GetByStudent(Guid studentId)
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Contracts.AsNoTracking()
                .Where(c => c.StudentId == studentId)
                .Select(c => new ContractInfoDto
                {
                    Id = c.Id,
                    StudentId = c.StudentId,
                    FileName = c.FileName,
                    FileSize = c.FileSize,
                    UploadedAt = c.UploadedAt,
                })
                .FirstOrDefault();
        }
        catch { return null; }
    }

    public (string? fileName, byte[]? data) GetFileById(Guid contractId)
    {
        using var context = new PlatformDbContext();
        try
        {
            var c = context.Contracts.AsNoTracking().FirstOrDefault(x => x.Id == contractId);
            return c is null ? (null, null) : (c.FileName, c.FileData);
        }
        catch { return (null, null); }
    }

    public bool Delete(Guid contractId)
    {
        using var context = new PlatformDbContext();
        try
        {
            var c = context.Contracts.FirstOrDefault(x => x.Id == contractId);
            if (c is null) return false;
            context.Contracts.Remove(c);
            return context.SaveChanges() > 0;
        }
        catch { return false; }
    }
}
