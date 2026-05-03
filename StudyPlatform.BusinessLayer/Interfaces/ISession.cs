using StudyPlatform.Domain.Entities.User;
using StudyPlatform.Domain.Models.User;

namespace StudyPlatform.BusinessLayer.Interfaces;

public interface ISession
{
    ULoginResp UserLogin(ULoginData data);
    string GenCookieValue(string loginCredential);
}
