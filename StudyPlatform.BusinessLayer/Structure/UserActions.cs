using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.BusinessLayer.Structure;

public class UserActions
{
    private readonly PlatformDbContext _dbContext;

    public UserActions()
    {
        _dbContext = new PlatformDbContext();
    }

    public bool CreateUser(UserInfoDto dto)
    {
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim(),
            Role = dto.Role 
        };

        _dbContext.Users.Add(user);
        return _dbContext.SaveChanges() > 0;
    }

    public bool UpdateUser(Guid id, UserInfoDto dto)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.Id == id);
        if (user is null) return false;

        user.FirstName = dto.FirstName.Trim();
        user.LastName = dto.LastName.Trim();
        user.Email = dto.Email.Trim();
        user.Role = dto.Role;

        _dbContext.Users.Update(user);
        return _dbContext.SaveChanges() > 0;
    }

    public bool DeleteUser(Guid id)
    {
        var user = _dbContext.Users.FirstOrDefault(x => x.Id == id);
        if (user is null) return false;

        _dbContext.Users.Remove(user);
        return _dbContext.SaveChanges() > 0;
    }

    public UserInfoDto? GetUserById(Guid id)
    {
        var user = _dbContext.Users.AsNoTracking().FirstOrDefault(x => x.Id == id);
        if (user is null) return null;

        return new UserInfoDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role
        };
    }

    public List<UserInfoDto> GetUserList()
    {
        return _dbContext.Users
            .AsNoTracking()
            .Select(x => new UserInfoDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                Role = x.Role
            }).ToList();
    }
}