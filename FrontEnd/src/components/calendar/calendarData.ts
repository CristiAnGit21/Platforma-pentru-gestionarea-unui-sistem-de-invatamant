import type { CalendarEvent } from './calendarTypes';

const MOCK_EVENTS: CalendarEvent[] = [
    { id: '1',  title: 'Examen Programare Web',             type: 'examen',    date: '2026-02-25', startTime: '09:00', endTime: '11:00', location: 'Sala 101',       professor: 'Dr. Popescu',     description: 'Examen final, aduce foaie A4 cu notițe.' },
    { id: '2',  title: 'Examen Baze de Date',               type: 'examen',    date: '2026-02-27', startTime: '10:00', endTime: '12:00', location: 'Amfiteatrul A2', professor: 'Conf. Ionescu' },
    { id: '3',  title: 'Curs Algoritmi',                    type: 'curs',      date: '2026-02-21', startTime: '08:00', endTime: '09:30', location: 'Sala 305',       professor: 'Lect. Radu' },
    { id: '4',  title: 'Laborator Sisteme de Operare',      type: 'curs',      date: '2026-02-21', startTime: '11:30', endTime: '13:00', location: 'Laborator B',    professor: 'Ing. Matei' },
    { id: '5',  title: 'Curs Fizică',                       type: 'curs',      date: '2026-02-24', startTime: '13:30', endTime: '15:00', location: 'Sala 202',       professor: 'Prof. Stan' },
    { id: '6',  title: 'Sesiune Q&A Cariere IT',            type: 'eveniment', date: '2026-02-26', startTime: '16:00', endTime: '18:00', location: 'Aula Magna',     description: 'Prezentări din industrie, networking.' },
    { id: '7',  title: 'Hackathon Universitar',             type: 'eveniment', date: '2026-02-28', startTime: '09:00', endTime: '21:00', location: 'Campus Central',  description: 'Competiție pe echipe de 48 ore.' },
    { id: '8',  title: 'Curs Matematică Discretă',          type: 'curs',      date: '2026-02-23', startTime: '08:00', endTime: '09:30', location: 'Sala 110',       professor: 'Prof. Lupu' },
    { id: '9',  title: 'Examen Rețele de Calculatoare',     type: 'examen',    date: '2026-03-05', startTime: '09:00', endTime: '11:00', location: 'Sala 101',       professor: 'Dr. Grigorescu' },
    { id: '10', title: 'Ziua Porților Deschise',            type: 'eveniment', date: '2026-03-01', startTime: '10:00', endTime: '16:00', location: 'Campus Central',  description: 'Vizite ghidate, prezentări facultăți.' },
    { id: '11', title: 'Curs Inteligență Artificială',      type: 'curs',      date: '2026-02-24', startTime: '09:45', endTime: '11:15', location: 'Sala 408',       professor: 'Dr. Dumitrescu' },
    { id: '12', title: 'Curs Programare Orientată pe Obiecte', type: 'curs',   date: '2026-02-26', startTime: '08:00', endTime: '09:30', location: 'Sala 101',       professor: 'Dr. Popescu' },
];

export default MOCK_EVENTS;
