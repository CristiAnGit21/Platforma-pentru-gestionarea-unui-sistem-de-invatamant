using StudyPlatform.Domain.Models.Notification;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface INotificationLogic
{
    ServiceResponse GetAll();
    ServiceResponse Create(NotificationCreateDto dto, Guid createdByUserId);
    ServiceResponse Delete(Guid id);
}
