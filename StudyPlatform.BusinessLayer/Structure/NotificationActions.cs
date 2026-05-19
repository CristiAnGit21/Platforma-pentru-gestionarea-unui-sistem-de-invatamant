using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.Notification;

namespace StudyPlatform.BusinessLayer.Structure;

public class NotificationActions
{
    public List<NotificationInfoDto> GetAll()
    {
        using var context = new PlatformDbContext();
        return context.Notifications
            .AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationInfoDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                CreatedAt = n.CreatedAt,
                CreatedByUserId = n.CreatedByUserId,
            })
            .ToList();
    }

    public bool Create(NotificationCreateDto dto, Guid createdByUserId)
    {
        using var context = new PlatformDbContext();
        var entity = new NotificationEntity
        {
            Title = dto.Title.Trim(),
            Message = dto.Message.Trim(),
            Type = dto.Type?.Trim().ToLower() ?? "general",
            CreatedByUserId = createdByUserId,
        };
        context.Notifications.Add(entity);
        return context.SaveChanges() > 0;
    }

    public bool Delete(Guid id)
    {
        using var context = new PlatformDbContext();
        var entity = context.Notifications.FirstOrDefault(n => n.Id == id);
        if (entity is null) return false;
        context.Notifications.Remove(entity);
        return context.SaveChanges() > 0;
    }
}
