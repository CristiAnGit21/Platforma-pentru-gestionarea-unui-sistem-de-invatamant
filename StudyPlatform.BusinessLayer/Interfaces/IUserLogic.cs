using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.User; 

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IUserLogic 
{
    ServiceResponse CreateUser(UserCreateDto userDto); // Modificat aici
    ServiceResponse UpdateUser(Guid id, UserInfoDto userDto);
    ServiceResponse DeleteUser(Guid id);
    ServiceResponse GetUserById(Guid id);
    ServiceResponse GetUserList();
}
