using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IUserLogic
{
    ULoginResp RegisterUser(UserCreateDto dto);
    ServiceResponse CreateUser(UserCreateDto userDto);
    ServiceResponse UpdateUser(Guid id, UserInfoDto userDto);
    ServiceResponse DeleteUser(Guid id);
    ServiceResponse GetUserById(Guid id);
    ServiceResponse GetUserList();
    ServiceResponse GetUsersByRole(UserRole role);
    ServiceResponse GetUsersByGroup(Guid groupId);
}
