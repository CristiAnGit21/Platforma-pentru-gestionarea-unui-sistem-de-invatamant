
import React, { useState } from 'react';
import GroupSection from '../components/GroupSection';
import AddStudentModal from '../components/AddStudentModal';
import { useStudents } from '../hooks/useStudents';
import { INITIAL_GROUPS } from '../constants';
import type {  Student } from '../types';

const StudentsPage: React.FC = () => {
    const {
        groupedStudents,
        addStudent,
        deleteStudent,
        addGrade,
        deleteGrade,
        updateStudent
    } = useStudents();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate total students across all groups
    const totalStudents = Object.values(groupedStudents).flat().length;

    return (
        <div className="w-full max-w-full overflow-x-hidden box-border px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Section */}
            <header className="flex flex-col gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">Gestionare Studenți</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Gestionați notele, prezența și grupele studenților.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group flex-1 min-w-0">
                        <input
                            type="text"
                            placeholder="Caută studenți..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all shadow-sm text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 shadow-lg shadow-purple-100 transition-all active:scale-95 text-sm whitespace-nowrap shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Adaugă Student</span>
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Total Studenți</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">{totalStudents}</p>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Grupe Active</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">{INITIAL_GROUPS.length}</p>
                </div>
                <div className="bg-purple-600 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl shadow-lg shadow-purple-100 text-white">
                    <p className="text-purple-100 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Prezență Medie</p>
                    <p className="text-2xl sm:text-3xl font-extrabold">88.5%</p>
                </div>
                <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">Grupa Fruntașă</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">TI-221</p>
                </div>
            </div>

            {/* Student Groups Content */}
            <div className="space-y-4">
                {Object.entries(groupedStudents).map(([groupName, students]) => {
                    const filteredStudents = (students as Student[]).filter(s =>
                        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (searchTerm && filteredStudents.length === 0) return null;

                    return (
                        <GroupSection
                            key={groupName}
                            name={groupName}
                            students={filteredStudents}
                            onDelete={deleteStudent}
                            onAddGrade={addGrade}
                            onDeleteGrade={deleteGrade}
                            onUpdateAttendance={(id, val) => updateStudent(id, { attendance: val })}
                        />
                    );
                })}
            </div>

            {isAddModalOpen && (
                <AddStudentModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={addStudent}
                    groups={INITIAL_GROUPS}
                />
            )}

            <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default StudentsPage;
