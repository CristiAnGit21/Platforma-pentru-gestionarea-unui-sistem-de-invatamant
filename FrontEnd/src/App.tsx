import { useState } from 'react';
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp"; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";

function App() {
    const [selectedPage, setSelectedPage] = useState("Acasă");
    const isAuth = localStorage.getItem("auth") === "true";

    return (
        <BrowserRouter>
            {isAuth ? (
                <div className="flex">
                    <NavBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                    <main className="flex-1 ml-24 min-h-screen bg-gray-50 overflow-x-hidden">
                        <AppRoutes />
                    </main>
                </div>
            ) : (
                <Routes>
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;