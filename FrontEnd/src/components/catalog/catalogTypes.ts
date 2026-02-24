// ══════════════════  Types  ══════════════════
export type StudentStatus = 'ACTIVE' | 'UNCONFIRMED';

export interface Grade {
    id: string;
    value: number;   // 1-10
    date: string;     // YYYY-MM-DD
    subject: string;
}

export interface AttendanceRecord {
    date: string;     // YYYY-MM-DD
    present: boolean;
}

export interface CatalogStudent {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: StudentStatus;
    grades: Grade[];
    attendance: AttendanceRecord[];
}

export interface Group {
    id: string;
    name: string;
    year: number;
    students: CatalogStudent[];
}

// ══════════════════  Helpers  ══════════════════
export const getAverage = (grades: Grade[]): number | null => {
    if (grades.length === 0) return null;
    const sum = grades.reduce((a, g) => a + g.value, 0);
    return Math.round((sum / grades.length) * 100) / 100;
};

export const getAttendancePercent = (records: AttendanceRecord[]): number | null => {
    if (records.length === 0) return null;
    const present = records.filter(r => r.present).length;
    return Math.round((present / records.length) * 100);
};

export const STATUS_CFG: Record<StudentStatus, { label: string; bg: string; text: string; dot: string }> = {
    ACTIVE: { label: 'Activ', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    UNCONFIRMED: { label: 'Neconfirmat', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

// ══════════════════  Mock Data  ══════════════════
const mkGrade = (id: string, v: number, d: string, subj: string): Grade => ({ id, value: v, date: d, subject: subj });
const mkAtt = (d: string, p: boolean): AttendanceRecord => ({ date: d, present: p });

export const MOCK_GROUPS: Group[] = [
    {
        id: 'g1', name: 'TI-221', year: 2,
        students: [
            {
                id: 's1', firstName: 'Andrei', lastName: 'Ionescu', email: 'a.ionescu@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr1', 9, '2026-02-10', 'Programare Web'), mkGrade('gr2', 8, '2026-02-15', 'Programare Web'), mkGrade('gr3', 10, '2026-02-18', 'Programare Web')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', true), mkAtt('2026-02-20', true), mkAtt('2026-02-21', false)],
            },
            {
                id: 's2', firstName: 'Maria', lastName: 'Popescu', email: 'm.popescu@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr4', 7, '2026-02-10', 'Programare Web'), mkGrade('gr5', 10, '2026-02-15', 'Programare Web')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', false), mkAtt('2026-02-19', true), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
            {
                id: 's3', firstName: 'Alexandru', lastName: 'Radu', email: 'a.radu@student.utm.md', status: 'UNCONFIRMED',
                grades: [mkGrade('gr6', 6, '2026-02-10', 'Programare Web')],
                attendance: [mkAtt('2026-02-17', false), mkAtt('2026-02-18', false), mkAtt('2026-02-19', true), mkAtt('2026-02-20', false), mkAtt('2026-02-21', false)],
            },
            {
                id: 's4', firstName: 'Elena', lastName: 'Dumitrescu', email: 'e.dumitrescu@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr7', 9, '2026-02-10', 'Programare Web'), mkGrade('gr8', 9, '2026-02-15', 'Programare Web'), mkGrade('gr9', 8, '2026-02-18', 'Programare Web')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', true), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
            {
                id: 's5', firstName: 'Victor', lastName: 'Stan', email: 'v.stan@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr10', 5, '2026-02-10', 'Programare Web'), mkGrade('gr11', 7, '2026-02-15', 'Programare Web')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', false), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
        ],
    },
    {
        id: 'g2', name: 'TI-222', year: 2,
        students: [
            {
                id: 's6', firstName: 'Diana', lastName: 'Moraru', email: 'd.moraru@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr12', 10, '2026-02-11', 'Baze de Date'), mkGrade('gr13', 9, '2026-02-16', 'Baze de Date')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', true), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
            {
                id: 's7', firstName: 'Cristian', lastName: 'Lupu', email: 'c.lupu@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr14', 8, '2026-02-11', 'Baze de Date'), mkGrade('gr15', 8, '2026-02-16', 'Baze de Date'), mkGrade('gr16', 7, '2026-02-19', 'Baze de Date')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', false), mkAtt('2026-02-19', true), mkAtt('2026-02-20', false), mkAtt('2026-02-21', true)],
            },
            {
                id: 's8', firstName: 'Ana', lastName: 'Grigorescu', email: 'a.grigorescu@student.utm.md', status: 'UNCONFIRMED',
                grades: [],
                attendance: [mkAtt('2026-02-17', false), mkAtt('2026-02-18', false), mkAtt('2026-02-19', false), mkAtt('2026-02-20', false), mkAtt('2026-02-21', false)],
            },
        ],
    },
    {
        id: 'g3', name: 'TI-311', year: 3,
        students: [
            {
                id: 's9', firstName: 'Mihai', lastName: 'Cojocaru', email: 'm.cojocaru@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr17', 10, '2026-02-12', 'Inteligență Artificială'), mkGrade('gr18', 10, '2026-02-17', 'Inteligență Artificială')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', true), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
            {
                id: 's10', firstName: 'Ioana', lastName: 'Matei', email: 'i.matei@student.utm.md', status: 'ACTIVE',
                grades: [mkGrade('gr19', 9, '2026-02-12', 'Inteligență Artificială'), mkGrade('gr20', 8, '2026-02-17', 'Inteligență Artificială')],
                attendance: [mkAtt('2026-02-17', true), mkAtt('2026-02-18', true), mkAtt('2026-02-19', false), mkAtt('2026-02-20', true), mkAtt('2026-02-21', true)],
            },
        ],
    },
];
