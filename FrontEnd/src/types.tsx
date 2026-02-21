
export type Grade = {
    id: string;
    value: number;
    date: string;
};

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    group: string;
    grades: Grade[];
    attendance: number; // percentage (0-100)
};

export type GroupData = {
    name: string;
    students: Student[];
};
