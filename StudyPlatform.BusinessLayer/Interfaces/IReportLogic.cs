using StudyPlatform.Domain.Models.Report;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IReportLogic
{
    ServiceResponse CreateReport(ReportCreateDto dto);
    ServiceResponse UpdateReport(Guid id, ReportInfoDto dto);
    ServiceResponse DeleteReport(Guid id);
    ServiceResponse GetReportById(Guid id);
    ServiceResponse GetReportList();
}