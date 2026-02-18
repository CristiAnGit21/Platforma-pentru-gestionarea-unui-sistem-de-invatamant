
import React, { useState } from 'react';

interface AddStudentModalProps {
    onClose: () => void;
    onAdd: (student: { firstName: string; lastName: string; group: string; attendance: number }) => void;
    groups: string[];
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAdd, groups }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [group, setGroup] = useState(groups[0] || '');
    const [attendance, setAttendance] = useState(100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (firstName && lastName && group) {
            onAdd({ firstName, lastName, group, attendance });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Add New Student</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-600">First Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="Ex: Alice"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-600">Last Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Ex: Johnson"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600">Group</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all appearance-none"
                            value={group}
                            onChange={e => setGroup(e.target.value)}
                        >
                            {groups.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-600">Initial Attendance (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                            value={attendance}
                            onChange={e => setAttendance(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                        >
                            Create Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
