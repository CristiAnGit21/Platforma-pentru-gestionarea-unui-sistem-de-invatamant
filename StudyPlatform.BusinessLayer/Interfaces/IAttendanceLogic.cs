using StudyPlatform.Domain.Models.Attendance;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IAttendanceLogic
{
    ServiceResponse CreateAttendance(AttendanceCreateDto dto);
    ServiceResponse UpdateAttendance(Guid id, AttendanceInfoDto dto);
    ServiceResponse DeleteAttendance(Guid id);
    ServiceResponse GetAttendanceById(Guid id);
    ServiceResponse GetAttendanceList();
    ServiceResponse GetAttendanceByStudent(Guid studentId);
}