// ══════════════════  Types  ══════════════════
export type StudentStatus = 'ACTIVE' | 'UNCONFIRMED';

export interface Grade {
    id: string;
    value: number;   // 1-10
    date: string;     // YYYY-MM-DD
    subject: string;
    subjectId?: string;
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

