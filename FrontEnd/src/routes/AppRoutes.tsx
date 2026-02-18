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
import RoleGuard from "./RoleGuard";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
                path={paths.students}
                element={<Students />}
            />
            <Route
                path={paths.orar}
                element={
                    <RoleGuard allowedRoles={["ADMIN", "PROFESOR", "ELEV"]}>
                        <Schedule />
                    </RoleGuard>
                }
            />
            <Route
                path={paths.notifications}
                element={
                    <RoleGuard allowedRoles={["PROFESOR", "ELEV"]}>
                        <Notifications />
                    </RoleGuard>
                }
            />
            <Route path={paths.contacts} element={<Contacts/>} />
            <Route
                path={paths.financialStatus}
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <FinancialStatus/>
                    </RoleGuard>
                }
            />
            <Route
                path="/studenti"
                element={
                    <RoleGuard allowedRoles={["ADMIN", "PROFESOR"]}>
                        <Students />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesori"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <ProfesoriPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/catalog"
                element={
                    <RoleGuard allowedRoles={["PROFESOR", "ELEV"]}>
                        <CatalogPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/raporteaza"
                element={
                    <RoleGuard allowedRoles={["PROFESOR", "ELEV"]}>
                        <RaporteazaPage />
                    </RoleGuard>
                }
            />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route
                path="/dashboard/admin"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/dashboard/profesor"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <ProfesorDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/dashboard/elev"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <ElevDashboard />
                    </RoleGuard>
                }
            />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
}

export default AppRoutes;