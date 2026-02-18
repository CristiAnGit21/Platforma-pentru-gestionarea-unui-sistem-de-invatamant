const ElevDashboard = () => {
    const tiles = [
        { title: "Orar", description: "Vezi programul și schimbările." },
        { title: "Note", description: "Consultă notele și progresul." },
        { title: "Teme", description: "Urmărește sarcinile și termenele." },
        { title: "Situație financiară", description: "Taxe, plăți și sold." },
    ];

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Dashboard Elev</h1>
                    <p className="text-gray-500 mt-2">
                        Totul la îndemână: orar, note și teme.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tiles.map((tile) => (
                        <button
                            key={tile.title}
                            type="button"
                            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                        >
                            <div className="text-gray-800 font-bold text-base">{tile.title}</div>
                            <div className="text-sm text-gray-500 mt-2">{tile.description}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ElevDashboard;
