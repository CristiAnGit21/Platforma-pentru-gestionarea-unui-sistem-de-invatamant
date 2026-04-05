using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Group;

namespace StudyPlatform.BusinessLayer.Structure;

public class GroupActions
{
    public bool CreateGroup(GroupCreateDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var group = new GroupEntity { Name = dto.Name.Trim(), Year = dto.Year };
            context.Groups.Add(group);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la creare grupă: {ex.Message}"); return false; }
    }

    public bool UpdateGroup(Guid id, GroupInfoDto dto)
    {
        using var context = new PlatformDbContext();
        try
        {
            var group = context.Groups.FirstOrDefault(x => x.Id == id);
            if (group is null) return false;
            group.Name = dto.Name.Trim();
            group.Year = dto.Year;
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la update grupă: {ex.Message}"); return false; }
    }

    public bool DeleteGroup(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var group = context.Groups.FirstOrDefault(x => x.Id == id);
            if (group is null) return false;
            context.Groups.Remove(group);
            return context.SaveChanges() > 0;
        }
        catch (Exception ex) { Console.WriteLine($"Eroare la ștergere grupă: {ex.Message}"); return false; }
    }

    public GroupInfoDto? GetGroupById(Guid id)
    {
        using var context = new PlatformDbContext();
        try
        {
            var group = context.Groups.AsNoTracking().FirstOrDefault(x => x.Id == id);
            if (group is null) return null;
            return new GroupInfoDto { Id = group.Id, Name = group.Name, Year = group.Year };
        }
        catch { return null; }
    }

    public List<GroupInfoDto> GetGroupList()
    {
        using var context = new PlatformDbContext();
        try
        {
            return context.Groups.AsNoTracking()
                .Select(x => new GroupInfoDto { Id = x.Id, Name = x.Name, Year = x.Year })
                .ToList();
        }
        catch { return new List<GroupInfoDto>(); }
    }
}