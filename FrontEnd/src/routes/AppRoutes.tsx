import { Routes,Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Orar from "../pages/Orar";
import Notifications from "../pages/Notifications";
import { paths } from "./paths";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path={paths.students} element={<Students />} />
            <Route path={paths.orar} element={<Orar />} />
            <Route path={paths.notifications} element={<Notifications />} />
        </Routes>
    );
}

export default AppRoutes;