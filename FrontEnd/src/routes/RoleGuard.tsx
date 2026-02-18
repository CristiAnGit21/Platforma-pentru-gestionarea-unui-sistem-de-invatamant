import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { getAuthSession } from "../auth/storage";
import type { Role } from "../auth/types";

type RoleGuardProps = {
    allowedRoles: Role[];
    children: ReactElement;
};

const dashboardByRole: Record<Role, string> = {
    ADMIN: "/dashboard/admin",
    PROFESOR: "/dashboard/profesor",
    ELEV: "/dashboard/elev",
};

const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
    const session = getAuthSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    const role = session.user.role;

    if (!allowedRoles.includes(role)) {
        const redirectTo = dashboardByRole[role] ?? "/";
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default RoleGuard;
