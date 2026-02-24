

export const COLORS = {
    primary: 'violet-600',
    primaryHover: 'violet-700',
    bgMain: 'slate-50',
    bgCard: 'white',
    textMain: 'slate-900',
    textMuted: 'slate-500',
    border: 'slate-200',
};

export const INITIAL_GROUPS = ['TI-221', 'TI-222', 'CR-223'];

export const calculateAverage = (grades: any[]): number => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.value, 0);
    return parseFloat((sum / grades.length).toFixed(2));
};
