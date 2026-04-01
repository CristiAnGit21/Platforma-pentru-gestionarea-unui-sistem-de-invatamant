using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.Domain.Models.Service;
using StudyPlatform.Domain.Models.Student;

namespace StudyPlatform.BusinessLayer.Core;

public class StudentLogic: StudentActions, IStudentLogic
{
    public new ServiceResponse CreateStudent(StudentCreateDto studentCreateDto)
    {
        if (string.IsNullOrWhiteSpace(studentCreateDto.FirstName) ||
            string.IsNullOrWhiteSpace(studentCreateDto.LastName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "FirstName and LastName are required."
            };
        }

        try
        {
            var created = base.CreateStudent(studentCreateDto);
            return new ServiceResponse
            {
                IsSuccess = created,
                Message = created ? "Student created." : "Student was not created.",
                Data = created
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
    }

    public new ServiceResponse UpdateStudent(int id, StudentCreateDto studentCreateDto)
    {
        if (string.IsNullOrWhiteSpace(studentCreateDto.FirstName) ||
            string.IsNullOrWhiteSpace(studentCreateDto.LastName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "FirstName and LastName are required."
            };
        }

        try
        {
            var updated = base.UpdateStudent(id, studentCreateDto);
            return new ServiceResponse
            {
                IsSuccess = updated,
                Message = updated ? "Student updated." : "Student not found.",
                Data = updated
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
    }

    public new ServiceResponse DeleteStudent(int id)
    {
        try
        {
            var deleted = base.DeleteStudent(id);
            return new ServiceResponse
            {
                IsSuccess = deleted,
                Message = deleted ? "Student deleted." : "Student not found.",
                Data = deleted
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
    }

    public new ServiceResponse GetStudentById(int id)
    {
        try
        {
            var student = base.GetStudentById(id);
            if (student is null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Student not found."
                };
            }

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = student
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
    }

    public new ServiceResponse GetStudentList()
    {
        try
        {
            var students = base.GetStudentList();
            return new ServiceResponse
            {
                IsSuccess = true,
                Data = students
            };
        }
        catch (Exception ex)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
    }
}
