export type CourseStatus = "upcoming" | "now" | "done";

export type CourseType = "Curs" | "Lab" | "Sem";

export type NotificationTag = "Note" | "Alerte" | "Orar" | "Financiar" | "Absente";

export type DeadlineSeverity = "low" | "medium" | "high";

export type StudentSummary = {
    group: string;
    year: number;
    semester: number;
    progressPercent: number;
    progressLabel: string;
    attendancePercent: number;
    creditsEarned: number;
    creditsTotal: number;
    absenceRisk: string;
};

export type StudentStats = {
    average: number;
    todayCourses: number;
    unreadNotifications: number;
    debtsLei: number;
};

export type StudentCourse = {
    time: string;
    subject: string;
    room: string;
    type: CourseType;
    status: CourseStatus;
};

export type StudentGrade = {
    subject: string;
    value: number;
    date: string;
};

export type StudentDeadline = {
    title: string;
    due: string;
    severity: DeadlineSeverity;
};

export type StudentNotification = {
    title: string;
    description: string;
    tag: NotificationTag;
    time: string;
    unread?: boolean;
};

export type ElevDashboardData = {
    summary: StudentSummary;
    stats: StudentStats;
    today: StudentCourse[];
    recentGrades: StudentGrade[];
    deadlines: StudentDeadline[];
    notifications: StudentNotification[];
};
