using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Models.User;
using StudyPlatform.Domain.Entities.Enums; // S-ar putea să fie .Enums sau .Entities.Enums depinde de folder


namespace StudyPlatform.BusinessLayer.Structure;

public class UserActions
{
    public bool CreateUser(UserCreateDto dto)
    {
        // 'using' garantează că DbContext-ul este închis corect după SaveChanges
        using (var context = new PlatformDbContext())
        {
            try
            {
                var user = new UserEntity
                {
                    // Id nu este setat aici; baza de date îl generează automat
                    FirstName = dto.FirstName.Trim(),
                    LastName = dto.LastName.Trim(),
                    Email = dto.Email.Trim(),
                    Role = dto.Role // Folosește tipul Enum
                };

                context.Users.Add(user);
                return context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                // Gestionarea erorilor în try-catch previne crash-ul aplicației
                Console.WriteLine($"Eroare la creare: {ex.Message}");
                return false;
            }
        }
    }

    public bool UpdateUser(Guid id, UserInfoDto dto)
    {
        using (var context = new PlatformDbContext())
        {
            try
            {
                var user = context.Users.FirstOrDefault(x => x.Id == id);
                if (user is null) return false;

                user.FirstName = dto.FirstName.Trim();
                user.LastName = dto.LastName.Trim();
                user.Email = dto.Email.Trim();
                user.Role = dto.Role;

                context.Users.Update(user);
                return context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Eroare la update: {ex.Message}");
                return false;
            }
        }
    }

    public bool DeleteUser(Guid id)
    {
        using (var context = new PlatformDbContext())
        {
            try
            {
                var user = context.Users.FirstOrDefault(x => x.Id == id);
                if (user is null) return false;

                context.Users.Remove(user);
                return context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Eroare la ștergere: {ex.Message}");
                return false;
            }
        }
    }

    public UserInfoDto? GetUserById(Guid id)
    {
        using (var context = new PlatformDbContext())
        {
            try
            {
                // AsNoTracking îmbunătățește performanța pentru operații de citire
                var user = context.Users.AsNoTracking().FirstOrDefault(x => x.Id == id);
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
            catch (Exception)
            {
                return null;
            }
        }
    }

    public List<UserInfoDto> GetUserList()
    {
        using (var context = new PlatformDbContext())
        {
            try
            {
                return context.Users
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
            catch (Exception)
            {
                return new List<UserInfoDto>();
            }
        }
    }

    public List<UserInfoDto> GetUsersByRole(UserRole role)
    {
        using (var context = new PlatformDbContext())
        {
            try
            {
                return context.Users
                    .AsNoTracking()
                    .Where(x => x.Role == role)
                    .Select(x => new UserInfoDto
                    {
                        Id = x.Id,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        Email = x.Email,
                        Role = x.Role
                    }).ToList();
            }
            catch (Exception)
            {
                return new List<UserInfoDto>();
            }
        }
    }
}