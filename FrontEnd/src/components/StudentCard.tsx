
import React, { useState } from 'react';
import type {  Student } from '../types';
import { calculateAverage } from '../constants';

interface StudentCardProps {
    student: Student;
    onDelete: (id: string) => void;
    onAddGrade: (studentId: string, value: number) => void;
    onDeleteGrade: (studentId: string, gradeId: string) => void;
    onUpdateAttendance: (studentId: string, value: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
                                                     student,
                                                     onDelete,
                                                     onAddGrade,
                                                     onDeleteGrade,
                                                     onUpdateAttendance
                                                 }) => {
    const [showGradeInput, setShowGradeInput] = useState(false);
    const [newGrade, setNewGrade] = useState<string>('');
    const average = calculateAverage(student.grades);

    const handleAddGrade = () => {
        const val = parseFloat(newGrade);
        if (!isNaN(val) && val >= 0 && val <= 10) {
            onAddGrade(student.id, val);
            setNewGrade('');
            setShowGradeInput(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0 overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">
                        {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 leading-tight">
                            {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{student.group}</p>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(student.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                {/* Attendance */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-600">Prezență</span>
                        <span className="text-xs font-bold text-purple-600">{student.attendance}%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 transition-all duration-500"
                                style={{ width: `${student.attendance}%` }}
                            />
                        </div>
                        <input
                            type="number"
                            value={student.attendance}
                            onChange={(e) => onUpdateAttendance(student.id, parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs border border-gray-200 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-purple-400"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>

                {/* Grades */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-600">Note</span>
                        <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  average >= 8 ? 'bg-green-100 text-green-700' :
                      average >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              }`}>
                Medie: {average}
              </span>
                            <button
                                onClick={() => setShowGradeInput(!showGradeInput)}
                                className="p-1 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {showGradeInput && (
                        <div className="flex items-center space-x-2 mb-3 animate-fade-in">
                            <input
                                autoFocus
                                type="number"
                                placeholder="0-10"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:ring-1 focus:ring-purple-400 focus:outline-none"
                            />
                            <button
                                onClick={handleAddGrade}
                                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 font-medium"
                            >
                                Adaugă
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                        {student.grades.length === 0 ? (
                            <p className="text-[10px] text-gray-400 italic">Nicio notă înregistrată</p>
                        ) : (
                            student.grades.map(grade => (
                                <div
                                    key={grade.id}
                                    className="group relative flex items-center bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-700 px-2 py-1 rounded-lg"
                                >
                                    {grade.value}
                                    <button
                                        onClick={() => onDeleteGrade(student.id, grade.id)}
                                        className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
