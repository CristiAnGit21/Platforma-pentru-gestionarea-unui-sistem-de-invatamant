import { FolderGit2, Clock } from 'lucide-react';

const projects = [
    {
        title: "Aplicație E-Commerce",
        course: "Programare Web",
        deadline: "2 zile rămase",
        progress: 75,
        color: "bg-blue-500",
        bg: "bg-blue-100"
    },
    {
        title: "Normalizare Bază de Date",
        course: "Baze de Date",
        deadline: "5 zile rămase",
        progress: 40,
        color: "bg-violet-500",
        bg: "bg-violet-100"
    },
    {
        title: "Algoritm Dijkstra",
        course: "Structuri de Date",
        deadline: "1 săptămână",
        progress: 15,
        color: "bg-amber-500",
        bg: "bg-amber-100"
    },
];

const ActiveProjects = () => {
    return (
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

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-2.5 rounded-full ${project.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>

                        <div className="text-right mt-1">
                            <span className="text-xs font-bold text-slate-400">{project.progress}%</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-violet-300 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
                + Adaugă Proiect Nou
            </button>
        </div>
    );
};

export default ActiveProjects;