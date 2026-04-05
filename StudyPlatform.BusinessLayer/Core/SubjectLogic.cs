using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.Subject;

namespace StudyPlatform.BusinessLayer.Core;

public class SubjectLogic : SubjectActions, ISubjectLogic
{
    public ServiceResponse CreateSubject(SubjectCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return new ServiceResponse { IsSuccess = false, Message = "Numele materiei este obligatoriu." };
        try
        {
            var res = base.CreateSubject(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Materie creată cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateSubject(Guid id, SubjectInfoDto dto)
    {
        try
        {
            var res = base.UpdateSubject(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Materie actualizată." : "Materia nu a fost găsită." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteSubject(Guid id)
    {
        try
        {
            var res = base.DeleteSubject(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Materie ștearsă." : "Materia nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetSubjectById(Guid id)
    {
        try
        {
            var subject = base.GetSubjectById(id);
            if (subject is null) return new ServiceResponse { IsSuccess = false, Message = "Materia nu a fost găsită." };
            return new ServiceResponse { IsSuccess = true, Data = subject };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetSubjectList()
    {
        try
        {
            var list = base.GetSubjectList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} materii." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}