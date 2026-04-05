using StudyPlatform.Domain.Models.Group;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IGroupLogic
{
    ServiceResponse CreateGroup(GroupCreateDto dto);
    ServiceResponse UpdateGroup(Guid id, GroupInfoDto dto);
    ServiceResponse DeleteGroup(Guid id);
    ServiceResponse GetGroupById(Guid id);
    ServiceResponse GetGroupList();
}