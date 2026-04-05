using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Group;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class GroupLogic : GroupActions, IGroupLogic
{
    public ServiceResponse CreateGroup(GroupCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return new ServiceResponse { IsSuccess = false, Message = "Numele grupei este obligatoriu." };
        try
        {
            var res = base.CreateGroup(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Grupă creată cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateGroup(Guid id, GroupInfoDto dto)
    {
        try
        {
            var res = base.UpdateGroup(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Grupă actualizată." : "Grupa nu a fost găsită." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteGroup(Guid id)
    {
        try
        {
            var res = base.DeleteGroup(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Grupă ștearsă." : "Grupa nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetGroupById(Guid id)
    {
        try
        {
            var group = base.GetGroupById(id);
            if (group is null) return new ServiceResponse { IsSuccess = false, Message = "Grupa nu a fost găsită." };
            return new ServiceResponse { IsSuccess = true, Data = group };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetGroupList()
    {
        try
        {
            var list = base.GetGroupList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} grupe." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}