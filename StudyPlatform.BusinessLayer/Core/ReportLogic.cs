using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Report;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Core;

public class ReportLogic : ReportActions, IReportLogic
{
    public ServiceResponse CreateReport(ReportCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Subject) || string.IsNullOrWhiteSpace(dto.Description))
            return new ServiceResponse { IsSuccess = false, Message = "Subiectul și descrierea sunt obligatorii." };
        try
        {
            var res = base.CreateReport(dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Raport trimis cu succes." : "Eroare la salvare." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse UpdateReport(Guid id, ReportInfoDto dto)
    {
        try
        {
            var res = base.UpdateReport(id, dto);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Raport actualizat." : "Raportul nu a fost găsit." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse DeleteReport(Guid id)
    {
        try
        {
            var res = base.DeleteReport(id);
            return new ServiceResponse { IsSuccess = res, Message = res ? "Raport șters." : "Raportul nu există." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetReportById(Guid id)
    {
        try
        {
            var report = base.GetReportById(id);
            if (report is null) return new ServiceResponse { IsSuccess = false, Message = "Raportul nu a fost găsit." };
            return new ServiceResponse { IsSuccess = true, Data = report };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }

    public ServiceResponse GetReportList()
    {
        try
        {
            var list = base.GetReportList();
            return new ServiceResponse { IsSuccess = true, Data = list, Message = $"Au fost găsite {list.Count} rapoarte." };
        }
        catch (Exception ex) { return new ServiceResponse { IsSuccess = false, Message = ex.Message }; }
    }
}