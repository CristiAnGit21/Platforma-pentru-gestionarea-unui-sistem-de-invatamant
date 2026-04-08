using StudyPlatform.BusinessLayer.Core;
using StudyPlatform.BusinessLayer.Interfaces;

namespace StudyPlatform.BusinessLayer;

public class BusinessLogic
{
    public IUserLogic UserLogic() => new UserLogic();
    public IGroupLogic GroupLogic() => new GroupLogic();
    public ISubjectLogic SubjectLogic() => new SubjectLogic();
    public IGradeLogic GradeLogic() => new GradeLogic();
    public IAttendanceLogic AttendanceLogic() => new AttendanceLogic();
    public IReportLogic ReportLogic() => new ReportLogic();
    public IEventLogic EventLogic() => new EventLogic();
}
