using System.ComponentModel.DataAnnotations;
using StudyPlatform.BusinessLayer.Interfaces;
using StudyPlatform.BusinessLayer.Structure;
using StudyPlatform.DataAccessLayer.Context;
using StudyPlatform.Domain.Entities;
using StudyPlatform.Domain.Entities.Enums;
using StudyPlatform.Domain.Entities.User;
using StudyPlatform.Domain.Models.User;
using StudyPlatform.Helpers;

namespace StudyPlatform.BusinessLayer.Core;

public class SessionBL : UserActions, ISession
{
    public ULoginResp UserLogin(ULoginData data)
    {
        var emailAttr = new EmailAddressAttribute();
        if (!emailAttr.IsValid(data.Credential))
            return new ULoginResp { Status = false, StatusMsg = "Adresa de email nu este validă." };

        var hashedPassword = LoginHelper.HashGen(data.Password);

        using var context = new PlatformDbContext();
        var user = context.Users.FirstOrDefault(u =>
            u.Email == data.Credential && u.Password == hashedPassword);

        if (user == null)
            return new ULoginResp { Status = false, StatusMsg = "Email sau parolă incorectă." };

        if (user.Status == UserStatus.Pending)
            return new ULoginResp { Status = false, StatusMsg = "Contul tău așteaptă aprobarea unui administrator." };

        if (user.Status == UserStatus.Inactive)
            return new ULoginResp { Status = false, StatusMsg = "Contul tău a fost dezactivat. Contactează administratorul." };

        user.LastIp = data.LoginIp;
        user.LastLogin = data.LoginDateTime;
        context.SaveChanges();

        var roleStr = user.Role switch
        {
            UserRole.Admin => "ADMIN",
            UserRole.Professor => "PROFESOR",
            _ => "STUDENT"
        };

        return new ULoginResp
        {
            Status = true,
            UserId = user.Id.ToString(),
            Name = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Role = roleStr
        };
    }

    public string GenCookieValue(string loginCredential)
    {
        var cookieValue = CookieGenerator.Create(loginCredential);

        using var context = new PlatformDbContext();
        var session = context.Sessions.FirstOrDefault(s => s.Username == loginCredential);

        if (session != null)
        {
            session.CookieString = cookieValue;
            session.ExpireTime = DateTime.UtcNow.AddMinutes(60);
        }
        else
        {
            context.Sessions.Add(new SessionEntity
            {
                Username = loginCredential,
                CookieString = cookieValue,
                ExpireTime = DateTime.UtcNow.AddMinutes(60)
            });
        }
        context.SaveChanges();

        return cookieValue;
    }
}
