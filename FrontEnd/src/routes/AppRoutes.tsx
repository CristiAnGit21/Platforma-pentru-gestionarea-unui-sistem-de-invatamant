import { Routes,Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Orar from "../pages/Orar";
import Notifications from "../pages/Notifications";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/orar" element={<Orar />} />
            <Route path="/notificari" element={<Notifications />} />
        </Routes>
    );
}

export default AppRoutes;