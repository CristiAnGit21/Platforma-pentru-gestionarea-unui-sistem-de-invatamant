using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.BusinessLayer.Core;

public class UserLogic : UserActions, IUserLogic
{
   
    public ServiceResponse CreateUser(UserCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.Email))
        {
            return new ServiceResponse 
            { 
                IsSuccess = false, 
                Message = "Prenumele și Email-ul sunt câmpuri obligatorii." 
            };
        }

        try
        {
            // Apelăm metoda din UserActions care acum se ocupă de blocul 'using' și 'try-catch'
            var res = base.CreateUser(dto);
            return new ServiceResponse 
            { 
                IsSuccess = res, 
                Message = res ? "Utilizator creat cu succes." : "Eroare tehnică la salvarea în baza de date." 
            };
        }
        catch (Exception ex) 
        { 
            return new ServiceResponse { IsSuccess = false, Message = ex.Message }; 
        }
    }

    public ServiceResponse UpdateUser(Guid id, UserInfoDto dto)
    {
        try
        {
            var res = base.UpdateUser(id, dto);
            return new ServiceResponse 
            { 
                IsSuccess = res, 
                Message = res ? "Datele au fost actualizate." : "Utilizatorul nu a fost găsit sau actualizarea a eșuat." 
            };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteUser(Guid id)
    {
        try
        {
            var res = base.DeleteUser(id);
            return new ServiceResponse 
            { 
                IsSuccess = res, 
                Message = res ? "Utilizator eliminat." : "Eroare: Utilizatorul nu există." 
            };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetUserById(Guid id)
    {
        try
        {
            var user = base.GetUserById(id);
            if (user == null) 
                return new ServiceResponse { IsSuccess = false, Message = "Utilizatorul solicitat nu a fost găsit." };
            
            return new ServiceResponse { IsSuccess = true, Data = user };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetUserList()
    {
        try
        {
            var users = base.GetUserList();
            return new ServiceResponse
            {
                IsSuccess = true,
                Data = users,
                Message = $"Au fost găsiți {users.Count} utilizatori."
            };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetUsersByRole(UserRole role)
    {
        try
        {
            var users = base.GetUsersByRole(role);
            return new ServiceResponse
            {
                IsSuccess = true,
                Data = users,
                Message = $"Au fost găsiți {users.Count} utilizatori cu rolul {role}."
            };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}