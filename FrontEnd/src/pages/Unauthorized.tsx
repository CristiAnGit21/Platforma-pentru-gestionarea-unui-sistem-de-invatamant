import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
                <h1 className="text-7xl font-extrabold text-purple-600">401</h1>
                <h2 className="text-2xl font-bold text-gray-800 mt-3">Neautorizat</h2>
                <p className="mt-3 text-gray-500 text-sm">
                    Sesiunea ta a expirat sau nu ești autentificat.
                    Te rugăm să te autentifici din nou.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow transition-all"
                >
                    Mergi la autentificare
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
