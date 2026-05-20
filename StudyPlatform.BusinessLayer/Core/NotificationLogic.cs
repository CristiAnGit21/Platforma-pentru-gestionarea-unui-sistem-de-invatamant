using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Notification;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class NotificationLogic : NotificationActions, INotificationLogic
{
    public ServiceResponse GetAll()
    {
        try
        {
            var list = base.GetAll();
            return new ServiceResponse { IsSuccess = true, Data = list };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = ex.Message };
        }
    }

    public ServiceResponse Create(NotificationCreateDto dto, Guid createdByUserId)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return new ServiceResponse { IsSuccess = false, Message = "Titlul este obligatoriu." };
        if (string.IsNullOrWhiteSpace(dto.Message))
            return new ServiceResponse { IsSuccess = false, Message = "Mesajul este obligatoriu." };

        try
        {
            var ok = base.Create(dto, createdByUserId);
            return new ServiceResponse
            {
                IsSuccess = ok,
                Message = ok ? "Notificarea a fost trimisă." : "Eroare la salvare."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = ex.Message };
        }
    }

    public ServiceResponse Delete(Guid id)
    {
        try
        {
            var ok = base.Delete(id);
            return new ServiceResponse
            {
                IsSuccess = ok,
                IsNotFound = !ok,
                Message = ok ? "Notificarea a fost ștearsă." : "Notificarea nu a fost găsită."
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse { IsSuccess = false, Message = ex.Message };
        }
    }
}
