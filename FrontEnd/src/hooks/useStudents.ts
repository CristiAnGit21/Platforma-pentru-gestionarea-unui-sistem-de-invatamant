
import { useState, useCallback, useMemo } from 'react';
import type { Student, Grade } from '../types';
import { INITIAL_GROUPS } from '../constants';

const MOCK_STUDENTS: Student[] = [
    {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        group: 'TI-221',
        attendance: 92,
        grades: [
            { id: 'g1', value: 9.5, date: '2023-10-01' },
            { id: 'g2', value: 8.0, date: '2023-10-15' }
        ]
    },
    {
        id: '2',
        firstName: 'Bob',
        lastName: 'Smith',
        group: 'TI-221',
        attendance: 85,
        grades: [{ id: 'g3', value: 7.5, date: '2023-10-05' }]
    },
    {
        id: '3',
        firstName: 'Charlie',
        lastName: 'Davis',
        group: 'TI-222',
        attendance: 78,
        grades: [{ id: 'g4', value: 10, date: '2023-10-10' }]
    }
];

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

    const addStudent = useCallback((newStudent: Omit<Student, 'id' | 'grades'>) => {
        const student: Student = {
            ...newStudent,
            id: crypto.randomUUID(),
            grades: []
        };
        setStudents(prev => [...prev, student]);
    }, []);

    const deleteStudent = useCallback((id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    }, []);

    const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const addGrade = useCallback((studentId: string, value: number) => {
        const newGrade: Grade = {
            id: crypto.randomUUID(),
            value,
            date: new Date().toISOString().split('T')[0]
        };
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, grades: [...s.grades, newGrade] } : s
        ));
    }, []);

    const deleteGrade = useCallback((studentId: string, gradeId: string) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, grades: s.grades.filter(g => g.id !== gradeId) } : s
        ));
    }, []);

    const groupedStudents = useMemo(() => {
        const groups: Record<string, Student[]> = {};

        // Ensure initial groups exist even if empty
        INITIAL_GROUPS.forEach(g => groups[g] = []);

        students.forEach(s => {
            if (!groups[s.group]) groups[s.group] = [];
            groups[s.group].push(s);
        });

        return groups;
    }, [students]);

    return {
        students,
        groupedStudents,
        addStudent,
        deleteStudent,
        updateStudent,
        addGrade,
        deleteGrade
    };
};
