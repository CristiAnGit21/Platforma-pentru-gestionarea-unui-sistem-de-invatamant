using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.Student;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface IStudentLogic
{
    ServiceResponse CreateStudent(StudentCreateDto studentCreateDto);
    ServiceResponse UpdateStudent(int id, StudentCreateDto studentCreateDto);
    ServiceResponse DeleteStudent(int id);
    ServiceResponse GetStudentById(int id);
    ServiceResponse GetStudentList();
}
