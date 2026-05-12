import { useNavigate } from "react-router-dom";

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                <h1 className="text-7xl font-extrabold text-red-500">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mt-3">Acces interzis</h2>
                <p className="mt-3 text-gray-500 text-sm">
                    Nu ai permisiunile necesare pentru a accesa această resursă.
                </p>
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                    >
                        Înapoi
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow transition-all"
                    >
                        Acasă
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
