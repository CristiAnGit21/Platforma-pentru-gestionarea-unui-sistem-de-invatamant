using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities.Student;
using StudyPlatform.Domain.Models.Student;

namespace StudyPlatform.BusinessLayer.Structure;

public class StudentActions
{
    private readonly PlatformDbContext _dbContext;

    public StudentActions()
    {
        _dbContext = new PlatformDbContext();
    }

    public bool CreateStudent(StudentCreateDto studentCreateDto)
    {
        var student = new StudentEntity
        {
            FirstName = studentCreateDto.FirstName.Trim(),
            LastName = studentCreateDto.LastName.Trim()
        };

        _dbContext.Students.Add(student);
        return _dbContext.SaveChanges() > 0;
    }

    public bool UpdateStudent(int id, StudentCreateDto studentCreateDto)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        if (student is null)
        {
            return false;
        }

        student.FirstName = studentCreateDto.FirstName.Trim();
        student.LastName = studentCreateDto.LastName.Trim();

        _dbContext.Students.Update(student);
        _dbContext.SaveChanges();
        return true;
    }

    public bool DeleteStudent(int id)
    {
        var student = _dbContext.Students.FirstOrDefault(x => x.Id == id);
        if (student is null)
        {
            return false;
        }

        _dbContext.Students.Remove(student);
        return _dbContext.SaveChanges() > 0;
    }

    public StudentInfoDto? GetStudentById(int id)
    {
        var student = _dbContext.Students
            .AsNoTracking()
            .FirstOrDefault(x => x.Id == id);

        if (student is null)
        {
            return null;
        }

        return new StudentInfoDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName
        };
    }

    public List<StudentInfoDto> GetStudentList()
    {
        return _dbContext.Students
            .AsNoTracking()
            .Select(x => new StudentInfoDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName
            })
            .ToList();
    }
}
