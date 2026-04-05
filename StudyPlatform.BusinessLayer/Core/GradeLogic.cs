using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Grade;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class GradeLogic : GradeActions, IGradeLogic
{
    public ServiceResponse CreateGrade(GradeCreateDto dto)
    {
        if (dto.Value < 1 || dto.Value > 10)
            return new ServiceResponse { IsSuccess = false, Message = "Nota trebuie să fie între 1 și 10." };
        try
        {
            var res = base.CreateGrade(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Notă adăugată cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateGrade(Guid id, GradeInfoDto dto)
    {
        try
        {
            var res = base.UpdateGrade(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Notă actualizată." : "Nota nu a fost găsită." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteGrade(Guid id)
    {
        try
        {
            var res = base.DeleteGrade(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Notă ștearsă." : "Nota nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetGradeById(Guid id)
    {
        try
        {
            var grade = base.GetGradeById(id);
            if (grade is null) return new ServiceResponse { IsSuccess = false, Message = "Nota nu a fost găsită." };
            return new ServiceResponse { IsSuccess = true, Data = grade };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetGradeList()
    {
        try
        {
            var list = base.GetGradeList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} note." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetGradesByStudent(Guid studentId)
    {
        try
        {
            var list = base.GetGradesByStudent(studentId);
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} note pentru student." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}