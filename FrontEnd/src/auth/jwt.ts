import { jwtDecode } from "jwt-decode";
import type { Role } from "./types";

// .NET ClaimTypes serialize to full URI strings in the JWT payload
const CLAIM_ID    = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const CLAIM_NAME  = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const CLAIM_EMAIL = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const CLAIM_ROLE  = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

interface DotNetJwtPayload {
    [CLAIM_ID]:    string;
    [CLAIM_NAME]:  string;
    [CLAIM_EMAIL]: string;
    [CLAIM_ROLE]:  string;
    exp: number;
    iss: string;
    aud: string;
}

export interface DecodedUser {
    id:    string;
    name:  string;
    email: string;
    role:  Role;
}

export function decodeToken(token: string): DecodedUser | null {
    try {
        const payload = jwtDecode<DotNetJwtPayload>(token);
        const role = payload[CLAIM_ROLE] as Role;

        if (!payload[CLAIM_ID] || !role) return null;

        return {
            id:    payload[CLAIM_ID],
            name:  payload[CLAIM_NAME],
            email: payload[CLAIM_EMAIL] ?? "",
            role,
        };
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}
