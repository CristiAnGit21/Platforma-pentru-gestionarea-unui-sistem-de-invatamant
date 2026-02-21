
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Adaugă Student Nou</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">Prenume</label>
                            <input
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="Ex: Maria"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600">Nume</label>
                            <input
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Ex: Popescu"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Grupă</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all appearance-none"
                            value={group}
                            onChange={e => setGroup(e.target.value)}
                        >
                            {groups.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Prezență Inițială (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                            value={attendance}
                            onChange={e => setAttendance(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Anulează
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all"
                        >
                            Creează Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
