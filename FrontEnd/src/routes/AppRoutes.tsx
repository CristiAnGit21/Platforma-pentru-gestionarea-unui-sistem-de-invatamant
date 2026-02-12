import { Routes,Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import PageNotFound from '../pages/404-page';
import Contacts from "../pages/Contacts";
import { paths } from "./paths";
import FinancialStatus from "../pages/FinancialStatus.tsx";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path={paths.students} element={<Students />} />
            <Route path={paths.orar} element={<Schedule />} />
            <Route path={paths.notifications} element={<Notifications />} />
            <Route path={paths.contacts} element={<Contacts/>} />
            <Route path={paths.financialStatus} element={<FinancialStatus/>} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default AppRoutes;