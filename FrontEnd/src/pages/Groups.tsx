import { useEffect, useState } from 'react';
import { Users, Plus, Pencil, Trash2, Check, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useApi } from '../providers/AxiosProvider';

type Group = { id: string; name: string; year: number };

const Groups = () => {
    const api = useApi();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newYear, setNewYear] = useState(1);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editYear, setEditYear] = useState(1);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const load = () => {
        api.get('/group').then(res => {
            setGroups((res.data?.data ?? res.data ?? []) as Group[]);
        }).catch(() => showToast('error', 'Eroare la încărcarea grupelor.'))
          .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [api]);

    const handleCreate = async () => {
        if (!newName.trim()) { showToast('error', 'Numele grupei este obligatoriu.'); return; }
        setSaving(true);
        try {
            await api.post('/group', { name: newName.trim(), year: newYear });
            showToast('success', 'Grupă creată cu succes.');
            setCreating(false);
            setNewName('');
            setNewYear(1);
            load();
        } catch {
            showToast('error', 'Eroare la crearea grupei.');
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (g: Group) => {
        setEditingId(g.id);
        setEditName(g.name);
        setEditYear(g.year);
    };

    const handleEdit = async (id: string) => {
        if (!editName.trim()) { showToast('error', 'Numele grupei este obligatoriu.'); return; }
        setSaving(true);
        try {
            await api.put(`/group/${id}`, { id, name: editName.trim(), year: editYear });
            showToast('success', 'Grupă actualizată.');
            setEditingId(null);
            load();
        } catch {
            showToast('error', 'Eroare la actualizarea grupei.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await api.delete(`/group/${id}`);
            showToast('success', 'Grupă ștearsă.');
            load();
        } catch {
            showToast('error', 'Eroare la ștergerea grupei.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full min-h-screen bg-gray-50/50">
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${
                    toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><Users size={22} /></div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Grupe</h1>
                        <p className="text-gray-500 font-medium text-sm">Gestionați grupele de studiu.</p>
                    </div>
                </div>
                {!creating && (
                    <button onClick={() => setCreating(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm">
                        <Plus size={16} /> Grupă nouă
                    </button>
                )}
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Create row */}
                {creating && (
                    <div className="flex items-center gap-3 p-4 border-b border-purple-100 bg-purple-50/40">
                        <input
                            autoFocus
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            placeholder="Nume grupă (ex. TI-241)"
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-purple-300 outline-none"
                        />
                        <div className="flex items-center gap-1.5">
                            <label className="text-xs font-semibold text-gray-500">Anul</label>
                            <input
                                type="number" min={1} max={6} value={newYear}
                                onChange={e => setNewYear(Number(e.target.value))}
                                className="w-16 px-2 py-2 rounded-xl border border-gray-200 text-sm text-center focus:ring-2 focus:ring-purple-300 outline-none"
                            />
                        </div>
                        <button onClick={handleCreate} disabled={saving}
                            className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 transition-colors">
                            <Check size={16} />
                        </button>
                        <button onClick={() => { setCreating(false); setNewName(''); setNewYear(1); }}
                            className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-purple-400" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-gray-400">
                        <Users size={40} className="mb-3 text-gray-200" />
                        <p className="text-sm font-medium">Nu există grupe. Creați prima grupă.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Grupă</th>
                                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">An</th>
                                <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3">Acțiuni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(g => (
                                <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3">
                                        {editingId === g.id ? (
                                            <input
                                                autoFocus
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') handleEdit(g.id); if (e.key === 'Escape') setEditingId(null); }}
                                                className="px-3 py-1.5 rounded-xl border border-purple-300 text-sm focus:ring-2 focus:ring-purple-300 outline-none w-48"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-gray-800">{g.name}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        {editingId === g.id ? (
                                            <input
                                                type="number" min={1} max={6} value={editYear}
                                                onChange={e => setEditYear(Number(e.target.value))}
                                                className="w-16 px-2 py-1.5 rounded-xl border border-purple-300 text-sm text-center focus:ring-2 focus:ring-purple-300 outline-none"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-600">Anul {g.year}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {editingId === g.id ? (
                                                <>
                                                    <button onClick={() => handleEdit(g.id)} disabled={saving}
                                                        className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 transition-colors">
                                                        <Check size={14} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(g)}
                                                        className="p-1.5 rounded-lg text-gray-300 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                                                        title="Editează">
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button onClick={() => handleDelete(g.id)} disabled={deletingId === g.id}
                                                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                                                        title="Șterge">
                                                        {deletingId === g.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Groups;
