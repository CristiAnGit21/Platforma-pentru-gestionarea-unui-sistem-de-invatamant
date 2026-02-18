import { useState } from "react";
import { FolderGit2, Clock, X } from "lucide-react";

interface Project {
    title: string;
    course: string;
    deadline: string;
    progress: number;
    color: string;
    bg: string;
}

interface ColorOption {
    color: string;
    bg: string;
    label: string;
}

interface FormState {
    title: string;
    course: string;
    deadline: string;
    progress: number;
    colorIdx: number;
}

const initialProjects: Project[] = [
    {
        title: "Aplicație E-Commerce",
        course: "Programare Web",
        deadline: "2 zile rămase",
        progress: 75,
        color: "bg-blue-500",
        bg: "bg-blue-100",
    },
    {
        title: "Normalizare Bază de Date",
        course: "Baze de Date",
        deadline: "5 zile rămase",
        progress: 40,
        color: "bg-violet-500",
        bg: "bg-violet-100",
    },
    {
        title: "Algoritm Dijkstra",
        course: "Structuri de Date",
        deadline: "1 săptămână",
        progress: 15,
        color: "bg-amber-500",
        bg: "bg-amber-100",
    },
];

const COLOR_OPTIONS: ColorOption[] = [
    { color: "bg-blue-500", bg: "bg-blue-100", label: "Albastru" },
    { color: "bg-violet-500", bg: "bg-violet-100", label: "Violet" },
    { color: "bg-amber-500", bg: "bg-amber-100", label: "Portocaliu" },
    { color: "bg-green-500", bg: "bg-green-100", label: "Verde" },
    { color: "bg-rose-500", bg: "bg-rose-100", label: "Roșu" },
    { color: "bg-cyan-500", bg: "bg-cyan-100", label: "Cyan" },
];

const ActiveProjects = () => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [form, setForm] = useState<FormState>({
        title: "",
        course: "",
        deadline: "",
        progress: 0,
        colorIdx: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): Record<string, string> => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Titlul este obligatoriu.";
        if (!form.course.trim()) e.course = "Cursul este obligatoriu.";
        if (!form.deadline.trim()) e.deadline = "Termenul este obligatoriu.";
        return e;
    };

    const handleAdd = () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        const selected = COLOR_OPTIONS[form.colorIdx];
        setProjects([...projects, {
            title: form.title.trim(),
            course: form.course.trim(),
            deadline: form.deadline.trim(),
            progress: Number(form.progress),
            color: selected.color,
            bg: selected.bg,
        }]);
        setForm({ title: "", course: "", deadline: "", progress: 0, colorIdx: 0 });
        setErrors({});
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setErrors({});
        setForm({ title: "", course: "", deadline: "", progress: 0, colorIdx: 0 });
    };

    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="p-2 bg-violet-100 rounded-lg text-violet-600">
                            <FolderGit2 size={20} />
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg">Proiecte în Lucru</h3>
                    </div>
                    <button className="text-sm text-slate-400 hover:text-violet-600 transition-colors">
                        Vezi toate
                    </button>
                </div>

                <div className="space-y-6">
                    {projects.map((project, idx) => (
                        <div key={idx} className="group">
                            <div className="flex justify-between mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm group-hover:text-violet-600 transition-colors">
                                        {project.title}
                                    </h4>
                                    <p className="text-xs text-slate-400">{project.course}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md h-fit">
                                    <Clock size={12} />
                                    {project.deadline}
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full ${project.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                            <div className="text-right mt-1">
                                <span className="text-xs font-bold text-slate-400">{project.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-violet-300 hover:text-violet-600 transition-all flex items-center justify-center gap-2"
                >
                    + Adaugă Proiect Nou
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative animate-fadeIn">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-lg font-bold text-slate-800 mb-5">Proiect Nou</h2>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Titlu proiect</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="ex: Aplicație Todo"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-violet-300 transition ${errors.title ? "border-rose-400" : "border-slate-200"}`}
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            {/* Course */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Curs</label>
                                <input
                                    type="text"
                                    value={form.course}
                                    onChange={e => setForm({ ...form, course: e.target.value })}
                                    placeholder="ex: Programare Web"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-violet-300 transition ${errors.course ? "border-rose-400" : "border-slate-200"}`}
                                />
                                {errors.course && <p className="text-xs text-rose-500 mt-1">{errors.course}</p>}
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Termen</label>
                                <input
                                    type="text"
                                    value={form.deadline}
                                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                                    placeholder="ex: 3 zile rămase"
                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-violet-300 transition ${errors.deadline ? "border-rose-400" : "border-slate-200"}`}
                                />
                                {errors.deadline && <p className="text-xs text-rose-500 mt-1">{errors.deadline}</p>}
                            </div>

                            {/* Progress */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Progres: <span className="text-violet-600 font-bold">{form.progress}%</span>
                                </label>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={form.progress}
                                    onChange={e => setForm({ ...form, progress: Number(e.target.value) })}
                                    className="w-full accent-violet-500"
                                />
                            </div>

                            {/* Color picker */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Culoare</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLOR_OPTIONS.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setForm({ ...form, colorIdx: i })}
                                            className={`w-7 h-7 rounded-full ${opt.color} transition-all ${form.colorIdx === i ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "opacity-70 hover:opacity-100"}`}
                                            title={opt.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className={`mt-5 p-3 rounded-xl ${COLOR_OPTIONS[form.colorIdx].bg} border border-slate-100`}>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Preview</p>
                            <div className="flex justify-between mb-1">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{form.title || "Titlu proiect"}</p>
                                    <p className="text-xs text-slate-400">{form.course || "Curs"}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md h-fit">
                                    <Clock size={12} />{form.deadline || "Termen"}
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full ${COLOR_OPTIONS[form.colorIdx].color} transition-all duration-300`}
                                    style={{ width: `${form.progress}%` }}
                                />
                            </div>
                            <div className="text-right mt-0.5">
                                <span className="text-xs font-bold text-slate-400">{form.progress}%</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-2 text-sm font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                            >
                                Anulează
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-2 text-sm font-bold text-white bg-violet-500 rounded-xl hover:bg-violet-600 transition"
                            >
                                Adaugă
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActiveProjects;