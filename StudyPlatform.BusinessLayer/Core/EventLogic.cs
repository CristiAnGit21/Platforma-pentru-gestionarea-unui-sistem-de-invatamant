using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Event;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class EventLogic : EventActions, IEventLogic
{
    public ServiceResponse CreateEvent(EventCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Location))
            return new ServiceResponse { IsSuccess = false, Message = "Titlul și locația sunt obligatorii." };
        try
        {
            var res = base.CreateEvent(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Eveniment creat cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateEvent(Guid id, EventInfoDto dto)
    {
        try
        {
            var res = base.UpdateEvent(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Eveniment actualizat." : "Evenimentul nu a fost găsit." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteEvent(Guid id)
    {
        try
        {
            var res = base.DeleteEvent(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Eveniment șters." : "Evenimentul nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetEventById(Guid id)
    {
        try
        {
            var ev = base.GetEventById(id);
            if (ev is null) return new ServiceResponse { IsSuccess = false, Message = "Evenimentul nu a fost găsit." };
            return new ServiceResponse { IsSuccess = true, Data = ev };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetEventList()
    {
        try
        {
            var list = base.GetEventList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} evenimente." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}