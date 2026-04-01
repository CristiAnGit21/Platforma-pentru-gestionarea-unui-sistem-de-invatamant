using StudyPlatform.BusinessLayer.Core;
using StudyPlatform.BusinessLayer.Interfaces;

namespace StudyPlatform.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IStudentLogic GetStudentLogic()
    {
        return new StudentLogic();
    }
}