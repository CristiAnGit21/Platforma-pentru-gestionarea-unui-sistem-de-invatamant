using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.BusinessLayer.Core;

public class UserLogic : UserActions, IUserLogic
{
    public ServiceResponse CreateUser(UserInfoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.Email))
            return new ServiceResponse { IsSuccess = false, Message = "Prenumele și Email-ul sunt obligatorii." };

        try
        {
            var res = base.CreateUser(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Utilizator creat cu succes." : "Eroare la crearea utilizatorului." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateUser(Guid id, UserInfoDto dto)
    {
        try
        {
            var res = base.UpdateUser(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Actualizat cu succes." : "Utilizatorul nu a fost găsit." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteUser(Guid id)
    {
        try
        {
            var res = base.DeleteUser(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Șters cu succes." : "Utilizatorul nu a fost găsit." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetUserById(Guid id)
    {
        try
        {
            var user = base.GetUserById(id);
            if (user == null) return new ServiceResponse { IsSuccess = false, Message = "Nu a fost găsit." };
            
            return new ServiceResponse { IsSuccess = true, Data = user };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetUserList()
    {
        try
        {
            var users = base.GetUserList();
            return new ServiceResponse { IsSuccess = true, Data = users };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}