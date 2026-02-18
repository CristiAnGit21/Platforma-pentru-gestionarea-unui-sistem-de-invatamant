import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/designarena_image_imvn6gn3.png";
import { mockLogin } from "../auth/mockAuth";
import { setAuthSession } from "../auth/storage";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        setIsLoading(true);

        try {
            const session = await mockLogin(email, password);
            setAuthSession(session);
            localStorage.setItem("auth", "true");
            window.location.reload();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Email sau parolă incorectă");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">

                <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-[#f9f9ff]">
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 w-full max-w-sm border border-gray-100">
                        <div className="mb-10 text-left">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Login</h2>
                            <p className="text-gray-500 text-sm">
                                Don't have an account?
                                <span
                                    onClick={() => navigate("/signup")}
                                    className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline"
                                >
                                    Sign Up
                                </span>
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-gray-700 font-semibold text-sm">Password</label>
                                    <span className="text-purple-600 text-xs font-semibold cursor-pointer hover:underline">
                                        Forgot Password?
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter 6 characters or more"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>

                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? "Loading..." : "Login"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex md:w-3/5 bg-[#fefefc] relative items-center justify-center overflow-hidden">

                    <img
                        src={loginImg}
                        alt="Login illustration"
                        className="w-full h-auto max-w-[90%] object-contain z-10"
                    />
                </div>
            </div>
        </div>
    );
};

export default LogIn;