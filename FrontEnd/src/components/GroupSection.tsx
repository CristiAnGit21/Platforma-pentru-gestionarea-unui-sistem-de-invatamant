
import React, { useState } from 'react';
import type {  Student } from '../types';
import StudentCard from './StudentCard';

interface GroupSectionProps {
    name: string;
    students: Student[];
    /* Fix: Rename onDeleteStudent to onDelete to match StudentCardProps expectation */
    onDelete: (id: string) => void;
    onAddGrade: (studentId: string, value: number) => void;
    onDeleteGrade: (studentId: string, gradeId: string) => void;
    onUpdateAttendance: (studentId: string, value: number) => void;
}

const GroupSection: React.FC<GroupSectionProps> = ({
                                                       name,
                                                       students,
                                                       ...handlers
                                                   }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-200 transition-all group"
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-bold text-slate-900 leading-none">{name}</h2>
                        <p className="text-sm text-slate-500 font-medium">{students.length} Students</p>
                    </div>
                </div>
                <svg
                    className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in">
                    {students.length === 0 ? (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-slate-400 text-sm font-medium">No students in this group yet.</p>
                        </div>
                    ) : (
                        students.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                {...handlers}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupSection;
