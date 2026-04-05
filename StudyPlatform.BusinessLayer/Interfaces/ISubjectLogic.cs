using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.Subject;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface ISubjectLogic
{
    ServiceResponse CreateSubject(SubjectCreateDto dto);
    ServiceResponse UpdateSubject(Guid id, SubjectInfoDto dto);
    ServiceResponse DeleteSubject(Guid id);
    ServiceResponse GetSubjectById(Guid id);
    ServiceResponse GetSubjectList();
}