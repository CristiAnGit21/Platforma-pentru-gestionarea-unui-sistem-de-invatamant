import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthSession } from "../auth/storage";
import type { Role } from "../auth/types";

type RoleGuardProps = {
    allowedRoles: Role[];
    children: ReactElement;
};

const dashboardByRole: Record<Role, string> = {
    ADMIN: "/admin/dashboard",
    PROFESOR: "/profesor/dashboard",
    ELEV: "/elev/dashboard",
};

const prefixByRole: Record<Role, string> = {
    ADMIN: "/admin",
    PROFESOR: "/profesor",
    ELEV: "/elev",
};

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
    const location = useLocation();
    const session = getAuthSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    const role = session.user.role;
    const allowedPrefix = prefixByRole[role];

    if (!location.pathname.startsWith(allowedPrefix)) {
        const redirectTo = dashboardByRole[role];
        return <Navigate to={redirectTo} replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={dashboardByRole[role]} replace />;
    }

    return children;
};

export default RoleGuard;
