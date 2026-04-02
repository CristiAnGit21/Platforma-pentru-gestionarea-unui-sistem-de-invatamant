using StudyPlatform.BusinessLayer.Core;
using StudyPlatform.BusinessLayer.Interfaces;

namespace StudyPlatform.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IUserLogic GetStudentLogic()
    {
        return new UserLogic();
    }
}