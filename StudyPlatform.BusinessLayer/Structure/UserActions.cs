using Microsoft.EntityFrameworkCore;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Models.User;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Helpers;


namespace StudyPlatform.BusinessLayer.Structure;

public class UserActions
{
    public bool CreateUser(UserCreateDto dto)
    {
        using (var context = new PlatformDbContext())
        {
            if (string.IsNullOrWhiteSpace(dto.FirstName))
            {
                throw new ArgumentException("Prenumele este obligatoriu.");
            }

            if (string.IsNullOrWhiteSpace(dto.LastName))
            {
                throw new ArgumentException("Numele este obligatoriu.");
            }

            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                throw new ArgumentException("Email-ul este obligatoriu.");
            }

            var normalizedEmail = dto.Email.Trim().ToLowerInvariant();
            var alreadyExists = context.Users.Any(x => x.Email.ToLower() == normalizedEmail);
            if (alreadyExists)
            {
                throw new InvalidOperationException("Există deja un utilizator cu acest email.");
            }

            var user = new UserEntity
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim(),
                Password = LoginHelper.HashGen(dto.Password),
                Role = dto.Role,
                Status = dto.Status == 0 ? UserStatus.Pending : dto.Status // Implicit Status = Pending dacă lipsește (0)
            };

            try
            {
                context.Users.Add(user);
                return context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                // Logare Erori Bază de Date:
                Console.WriteLine("Eroare la salvarea în baza de date:");
                Console.WriteLine(ex.Message);
                if (ex.InnerException != null)
                {
                    Console.WriteLine("Inner Exception:");
                    Console.WriteLine(ex.InnerException.Message);
                }
                throw; // Rethrow to be caught by UserLogic
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
                user.Status = dto.Status;

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
                    Role = user.Role,
                    Status = user.Status
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
                        Role = x.Role,
                        Status = x.Status
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
                        Role = x.Role,
                        Status = x.Status
                    }).ToList();
            }
            catch (Exception)
            {
                return new List<UserInfoDto>();
            }
        }
    }
}