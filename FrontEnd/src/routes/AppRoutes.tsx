import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Students from "../pages/Students";
import Schedule from "../pages/Schedule";
import Notifications from "../pages/Notifications";
import PageNotFound from '../pages/404-page';
import FinancialStatus from "../pages/FinancialStatus.tsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProfesorDashboard from "../pages/dashboard/ProfesorDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import CatalogPage from "../pages/placeholders/CatalogPage";
import Professors from "../pages/Professors";
import ReportPage from "../pages/ReportPage";
import RoleGuard from "./RoleGuard";
import { getAuthSession } from "../auth/storage";

type RoleKey = "ADMIN" | "PROFESOR" | "STUDENT";

const dashboardByRole: Record<RoleKey, string> = {
    ADMIN: "/admin/dashboard",
    PROFESOR: "/profesor/dashboard",
    STUDENT: "/student/dashboard",
};

const prefixByRole: Record<RoleKey, string> = {
    ADMIN: "/admin",
    PROFESOR: "/profesor",
    STUDENT: "/student",
};

const RoleCatchAll = () => {
    const location = useLocation();
    const session = getAuthSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    const role = session.user.role as RoleKey;
    const allowedPrefix = prefixByRole[role] ?? "/student";

    if (!location.pathname.startsWith(allowedPrefix)) {
        const redirectTo = dashboardByRole[role] ?? "/student/dashboard";
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
                path="/student/situatia-financiara"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <FinancialStatus />
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
                        <Professors />
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
                path="/student/catalog"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <CatalogPage />
                    </RoleGuard>
                }
            />
            <Route
                path="/student/orar"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <Schedule />
                    </RoleGuard>
                }
            />
            <Route
                path="/student/notificari"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
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
                path="/student/dashboard"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <StudentDashboard />
                    </RoleGuard>
                }
            />
            <Route
                path="/student/raporteaza"
                element={
                    <RoleGuard allowedRoles={["STUDENT"]}>
                        <ReportPage />
                    </RoleGuard>
                }
            />
            <Route path="*" element={<RoleCatchAll />} />
        </Routes>
    );
}

export default AppRoutes;