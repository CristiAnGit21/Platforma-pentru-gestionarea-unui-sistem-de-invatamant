import { AlertTriangle, BookOpen, Monitor, DollarSign, HelpCircle } from 'lucide-react';

// ══════════════════  Types  ══════════════════
export type ReportCategory = 'tehnic' | 'academic' | 'infrastructura' | 'financiar' | 'altele';
export type ReportPriority = 'scazuta' | 'medie' | 'ridicata';
export type ReportStatus = 'trimis' | 'in_lucru' | 'rezolvat' | 'respins';

export interface Report {
    id: string;
    category: ReportCategory;
    subject: string;
    description: string;
    priority: ReportPriority;
    status: ReportStatus;
    anonymous: boolean;
    createdAt: string;
    updatedAt: string;
}

// ══════════════════  Config  ══════════════════
export const CATEGORY_CFG: Record<ReportCategory, { label: string; icon: typeof BookOpen; color: string }> = {
    tehnic:         { label: 'Tehnic',         icon: Monitor,        color: 'text-blue-600 bg-blue-50' },
    academic:       { label: 'Academic',       icon: BookOpen,       color: 'text-violet-600 bg-violet-50' },
    infrastructura: { label: 'Infrastructură', icon: AlertTriangle,  color: 'text-orange-600 bg-orange-50' },
    financiar:      { label: 'Financiar',      icon: DollarSign,     color: 'text-green-600 bg-green-50' },
    altele:         { label: 'Altele',         icon: HelpCircle,     color: 'text-gray-600 bg-gray-100' },
};

export const PRIORITY_CFG: Record<ReportPriority, { label: string; dot: string; bg: string; text: string; border: string }> = {
    scazuta:  { label: 'Scăzută',  dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
    medie:    { label: 'Medie',    dot: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
    ridicata: { label: 'Ridicată', dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
};

export const STATUS_CFG: Record<ReportStatus, { label: string; dot: string; bg: string; text: string }> = {
    trimis:   { label: 'Trimis',    dot: 'bg-amber-400',  bg: 'bg-amber-50',  text: 'text-amber-700' },
    in_lucru: { label: 'În lucru',  dot: 'bg-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-700' },
    rezolvat: { label: 'Rezolvat',  dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
    respins:  { label: 'Respins',   dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
};

// ══════════════════  Mock Data  ══════════════════
export const MOCK_REPORTS: Report[] = [
    {
        id: 'RPT-0042',
        category: 'tehnic',
        subject: 'Eroare la autentificare pe platforma',
        description: 'Când încerc să mă loghez cu contul universitar, primesc eroare 500. Problema apare doar pe browser Chrome.',
        priority: 'ridicata',
        status: 'rezolvat',
        anonymous: false,
        createdAt: '2026-02-19T10:30:00',
        updatedAt: '2026-02-21T14:00:00',
    },
    {
        id: 'RPT-0041',
        category: 'academic',
        subject: 'Orar afișat incorect pentru grupa TI-221',
        description: 'Cursul de Algoritmi apare luni la ora 8, dar în realitate este miercuri la 10. Vă rog să corectați.',
        priority: 'medie',
        status: 'in_lucru',
        anonymous: false,
        createdAt: '2026-02-16T08:15:00',
        updatedAt: '2026-02-18T11:00:00',
    },
    {
        id: 'RPT-0039',
        category: 'academic',
        subject: 'Nota de la examenul de Baze de Date lipsește',
        description: 'Am susținut examenul pe 10 februarie dar nota nu apare în catalog. Colegii au primit-o deja.',
        priority: 'medie',
        status: 'trimis',
        anonymous: false,
        createdAt: '2026-02-14T16:45:00',
        updatedAt: '2026-02-14T16:45:00',
    },
    {
        id: 'RPT-0036',
        category: 'infrastructura',
        subject: 'Proiector defect în Sala 202',
        description: 'Proiectorul din Sala 202 nu mai pornește de 2 săptămâni. Cursurile sunt afectate.',
        priority: 'scazuta',
        status: 'respins',
        anonymous: true,
        createdAt: '2026-02-10T09:00:00',
        updatedAt: '2026-02-12T10:30:00',
    },
];
