import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Students from "../pages/Students";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import PageNotFound from '../pages/404-page';
import FinancialStatus from "../pages/FinancialStatus.tsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProfesorDashboard from "../pages/dashboard/ProfesorDashboard";
import ElevDashboard from "../pages/dashboard/ElevDashboard";
import CatalogPage from "../pages/placeholders/CatalogPage";
import ProfesoriPage from "../pages/placeholders/ProfesoriPage";
import ReportPage from "../pages/ReportPage";
import RoleGuard from "./RoleGuard";
import { getAuthSession } from "../auth/storage";

type RoleKey = "ADMIN" | "PROFESOR" | "ELEV";

const dashboardByRole: Record<RoleKey, string> = {
    ADMIN: "/admin/dashboard",
    PROFESOR: "/profesor/dashboard",
    ELEV: "/elev/dashboard",
};

const prefixByRole: Record<RoleKey, string> = {
    ADMIN: "/admin",
    PROFESOR: "/profesor",
    ELEV: "/elev",
};

const RoleCatchAll = () => {
    const location = useLocation();
    const session = getAuthSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    const role = session.user.role as RoleKey;
    const allowedPrefix = prefixByRole[role] ?? "/elev";

    if (!location.pathname.startsWith(allowedPrefix)) {
        const redirectTo = dashboardByRole[role] ?? "/elev/dashboard";
        return <Navigate to={redirectTo} replace />;
    }

    // Path is within an allowed area but didn't match any explicit route.
    return <PageNotFound />;
};

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/admin/orar"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <Schedule />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/notificari"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <Notifications />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/situatia-financiara"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <FinancialStatus/>
                    </RoleGuard>
                }
            />
            <Route
                path="/admin/studenti"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <Students />
                    </RoleGuard>
                }
            />
            <Route
                path="/admin/profesori"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <ProfesoriPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/catalog"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <CatalogPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/studenti"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <Students />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/catalog"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <CatalogPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/raporteaza"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <ReportPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/catalog"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <CatalogPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/orar"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <Schedule />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/notificari"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <Notifications />
                    </RoleGuard>
                }
            />
            <Route
                path="/admin/dashboard"
                element={
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/profesor/dashboard"
                element={
                    <RoleGuard allowedRoles={["PROFESOR"]}>
                        <ProfesorDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/dashboard"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <ElevDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/elev/raporteaza"
                element={
                    <RoleGuard allowedRoles={["ELEV"]}>
                        <ReportPage />
                    </RoleGuard>
                }
            />
            <Route path="*" element={<RoleCatchAll />} />
        </Routes>
    );
}

export default AppRoutes;