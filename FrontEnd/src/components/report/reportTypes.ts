import { AlertTriangle, BookOpen, Monitor, DollarSign, HelpCircle } from 'lucide-react';

// ══════════════════  Types  ══════════════════
export type ReportCategory = 'tehnic' | 'academic' | 'infrastructura' | 'financiar' | 'altele';
export type ReportPriority = 'scazuta' | 'medie' | 'ridicata';
export type ReportStatus = 'trimis' | 'inLucru' | 'rezolvat' | 'respins';

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
    inLucru: { label: 'În lucru',  dot: 'bg-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-700' },
    rezolvat: { label: 'Rezolvat',  dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
    respins:  { label: 'Respins',   dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
};

