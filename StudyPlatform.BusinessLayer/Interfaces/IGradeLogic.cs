using StudyPlatform.Domain.Models.Grade;
using StudyPlatform.Domain.Models.Service;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IGradeLogic
{
    ServiceResponse CreateGrade(GradeCreateDto dto);
    ServiceResponse UpdateGrade(Guid id, GradeInfoDto dto);
    ServiceResponse DeleteGrade(Guid id);
    ServiceResponse GetGradeById(Guid id);
    ServiceResponse GetGradeList();
    ServiceResponse GetGradesByStudent(Guid studentId);
}