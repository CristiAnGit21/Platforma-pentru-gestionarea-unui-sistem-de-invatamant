import { Navigate, Routes,Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import PageNotFound from '../pages/404-page';
import Contacts from "../pages/Contacts";
import { paths } from "./paths";
import FinancialStatus from "../pages/FinancialStatus.tsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProfesorDashboard from "../pages/dashboard/ProfesorDashboard";
import ElevDashboard from "../pages/dashboard/ElevDashboard";
import CatalogPage from "../pages/placeholders/CatalogPage";
import ProfesoriPage from "../pages/placeholders/ProfesoriPage";
import RaporteazaPage from "../pages/placeholders/RaporteazaPage";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path={paths.students} element={<Students />} />
            <Route path={paths.orar} element={<Schedule />} />
            <Route path={paths.notifications} element={<Notifications />} />
            <Route path={paths.contacts} element={<Contacts/>} />
            <Route path={paths.financialStatus} element={<FinancialStatus/>} />
            <Route path="/studenti" element={<Students />} />
            <Route path="/profesori" element={<ProfesoriPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/raporteaza" element={<RaporteazaPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/profesor" element={<ProfesorDashboard />} />
            <Route path="/dashboard/elev" element={<ElevDashboard />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default AppRoutes;