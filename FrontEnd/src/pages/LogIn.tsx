import { useState } from "react";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">
                
                <div className="p-8 md:p-12 md:pt-16 w-full md:w-2/5 flex flex-col bg-white">
                    
                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                            Login
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Don't have an account?
                            <span className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline">
                                 Sign Up
                            </span>
                        </p>
                    </div>
                    
                    <div className="w-full space-y-6">
                        <div className="w-full">
                            <label className="block text-gray-700 font-semibold text-sm mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all placeholder:text-gray-300"
                            />
                        </div>

                        
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-700 font-semibold text-sm">
                                    Password
                                </label>
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
                    </div>
                </div>
                
                <div className="hidden md:flex w-3/5 bg-purple-50 items-center justify-center">
                </div>
            </div>
        </div>
    );
};

export default LogIn;