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
        </div>
    );
};

export default LogIn;
