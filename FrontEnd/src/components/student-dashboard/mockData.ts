import type { StudentDashboardData } from "./types";

export const studentDashboardData: StudentDashboardData = {
    summary: {
        group: "TI-222",
        year: 2,
        semester: 2,
        progressPercent: 70,
        progressLabel: "12 / 16 saptamani finalizate",
        attendancePercent: 83,
        creditsEarned: 48,
        creditsTotal: 60,
        absenceRisk: "Scazut",
    },
    stats: {
        average: 8.4,
        todayCourses: 3,
        unreadNotifications: 5,
        debtsLei: 0,
    },
    today: [
        { time: "08:30", subject: "Programare Web", room: "Sala 305", type: "Lab", status: "done" },
        { time: "10:15", subject: "Algoritmi", room: "Sala 202", type: "Curs", status: "now" },
        { time: "14:00", subject: "Fizica", room: "Sala 101", type: "Curs", status: "upcoming" },
    ],
    recentGrades: [
        { subject: "Programare Web", value: 10, date: "Azi" },
        { subject: "Algoritmi", value: 9, date: "Ieri" },
        { subject: "Baze de Date", value: 8, date: "Acum 5 zile" },
    ],
    deadlines: [
        { title: "Proiect Baze de Date", due: "Maine 23:59", severity: "high" },
        { title: "Laborator SO", due: "In 2 zile", severity: "medium" },
        { title: "Seminar Fizica - fisa", due: "In 5 zile", severity: "low" },
    ],
    notifications: [
        {
            title: "Nota noua: 10 la Programare Web",
            description: "Dr. Popescu a adaugat nota 10.",
            tag: "Note",
            time: "Acum 1 min",
            unread: true,
        },
        {
            title: "Termen limita: Proiect BD",
            description: "Trebuie predat pana maine la 23:59.",
            tag: "Alerte",
            time: "Acum 1 ora",
            unread: true,
        },
        {
            title: "Absenta inregistrata: Laborator SO",
            description: "Ai fost marcat absent azi.",
            tag: "Absente",
            time: "Acum 3 ore",
        },
    ],
};
