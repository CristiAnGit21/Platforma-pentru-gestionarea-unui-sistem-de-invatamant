import { useState } from "react"; // 1. Adăugăm useState în import
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/designarena_image_imvn6gn3.png";

const SignUp = () => {
    const navigate = useNavigate();

    // 2. Definim stările pentru primele câmpuri
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">

                <div className="w-full md:w-2/5 flex items-center justify-center p-6 bg-[#f9f9ff]">
                    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 w-full max-w-sm border border-gray-100">

                        <div className="mb-8 text-left">
                            <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Sign Up</h2>
                            <p className="text-gray-500 text-sm">
                                I'm already a member.
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline"
                                >
                                    Login
                                </span>
                            </p>
                        </div>

                        {/* 3. Adăugăm câmpurile de input */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold text-sm mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300 text-sm"
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="hidden md:flex md:w-3/5 bg-[#fefefc] relative items-center justify-center overflow-hidden">
                    <img src={loginImg} alt="SignUp" className="w-full h-auto max-w-[90%] object-contain z-10" />
                </div>
            </div>
        </div>
    );
};

export default SignUp;