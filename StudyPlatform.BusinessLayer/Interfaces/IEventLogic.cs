using StudyPlatform.Domain.Models.Event;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IEventLogic
{
    ServiceResponse CreateEvent(EventCreateDto dto);
    ServiceResponse UpdateEvent(Guid id, EventInfoDto dto);
    ServiceResponse DeleteEvent(Guid id);
    ServiceResponse GetEventById(Guid id);
    ServiceResponse GetEventList();
}