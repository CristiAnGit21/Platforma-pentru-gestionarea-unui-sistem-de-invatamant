import { useState } from 'react';
import LogIn from "./pages/LogIn";
import { BrowserRouter } from "react-router-dom";
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
                    <main className="flex-1 ml-24 min-h-screen bg-gray-50">
                        <AppRoutes />
                    </main>
                </div>
            ) : (
                <LogIn />
            )}
        </BrowserRouter>
    );
}

export default App;