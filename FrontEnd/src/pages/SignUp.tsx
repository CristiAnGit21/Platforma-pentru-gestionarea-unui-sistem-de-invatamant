import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/designarena_image_imvn6gn3.png";

const SignUp = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignUp = () => {
        setError("");

        if (!fullName || !email || !password || !confirmPassword) {
            setError("Te rugăm să completezi toate câmpurile.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Parolele nu se potrivesc!");
            return;
        }

        if (password.length < 6) {
            setError("Parola trebuie să aibă cel puțin 6 caractere.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">

                <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-[#f9f9ff]">
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 w-full max-sm border border-gray-100">

                        <div className="mb-6 text-left">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Înregistrare</h2>
                            <p className="text-gray-500 text-sm">
                                Sunt deja membru.
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline"
                                >
                                    Autentificare
                                </span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Nume complet</label>
                                <input
                                    type="text"
                                    placeholder="Introdu numele complet"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Adresă de email</label>
                                <input
                                    type="email"
                                    placeholder="tu@exemplu.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Parolă</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors text-[10px] font-bold"
                                    >
                                        {showPassword ? "ASCUNDE" : "ARATĂ"}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Repetă parola</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-[11px] font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}

                            <button
                                onClick={handleSignUp}
                                disabled={isLoading || isSuccess}
                                className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all transform mt-2 flex items-center justify-center
                                    ${isSuccess ? "bg-green-500 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
                                    ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
                                `}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Se creează contul...
                                    </span>
                                ) : isSuccess ? (
                                    "Cont creat! ✓"
                                ) : (
                                    "Înregistrare"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex md:w-3/5 bg-[#fefefc] relative items-center justify-center overflow-hidden">
                    <img
                        src={loginImg}
                        alt="SignUp illustration"
                        className="w-full h-auto max-w-[90%] object-contain z-10"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;