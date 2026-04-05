using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Attendance;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class AttendanceLogic : AttendanceActions, IAttendanceLogic
{
    public ServiceResponse CreateAttendance(AttendanceCreateDto dto)
    {
        try
        {
            var res = base.CreateAttendance(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Prezență adăugată cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateAttendance(Guid id, AttendanceInfoDto dto)
    {
        try
        {
            var res = base.UpdateAttendance(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Prezență actualizată." : "Înregistrarea nu a fost găsită." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteAttendance(Guid id)
    {
        try
        {
            var res = base.DeleteAttendance(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Prezență ștearsă." : "Înregistrarea nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetAttendanceById(Guid id)
    {
        try
        {
            var record = base.GetAttendanceById(id);
            if (record is null) return new ServiceResponse { IsSuccess = false, Message = "Înregistrarea nu a fost găsită." };
            return new ServiceResponse { IsSuccess = true, Data = record };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetAttendanceList()
    {
        try
        {
            var list = base.GetAttendanceList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} înregistrări." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetAttendanceByStudent(Guid studentId)
    {
        try
        {
            var list = base.GetAttendanceByStudent(studentId);
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} înregistrări pentru student." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}