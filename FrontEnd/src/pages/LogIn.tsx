import { useState } from "react";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    

    const handleLogin = () => {
        if (email === "admin@test.com" && password === "1234") {
            localStorage.setItem("auth", "true");
            window.location.reload();
        } else {
            setError("Email sau parolă incorectă");
        }
    };

    return (
        
        <div>
            <h2>Log In</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Log In</button>

            {error && <p>{error}</p>}
            <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
                <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full min-h-[600px] overflow-hidden">
                    
                    <div className="p-8 md:p-12 w-full md:w-2/5 flex flex-col justify-center bg-white">
                        <div className="w-full">
                        </div>
                    </div>
                    
                    <div className="hidden md:flex w-3/5 bg-purple-50 items-center justify-center"></div>

                </div>
            </div>
        </div>
        
    );
    
};



export default LogIn;
