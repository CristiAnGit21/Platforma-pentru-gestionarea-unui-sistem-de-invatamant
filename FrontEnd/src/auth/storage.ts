import type { AuthSession } from "./types";

const AUTH_SESSION_KEY = "authSession";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
    if (!isRecord(value)) return false;
    if (typeof value.token !== "string") return false;
    if (!isRecord(value.user)) return false;

    const user = value.user;
    if (typeof user.id !== "string") return false;
    if (typeof user.name !== "string") return false;
    if (typeof user.email !== "string") return false;
    if (user.role !== "ADMIN" && user.role !== "PROFESOR" && user.role !== "ELEV") return false;

    return true;
}

export function getAuthSession(): AuthSession | null {
    try {
        const raw = localStorage.getItem(AUTH_SESSION_KEY);
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!isAuthSession(parsed)) return null;

        return parsed;
    } catch {
        // Corrupted/invalid JSON or unavailable storage; fail safely.
        return null;
    }
}

export function setAuthSession(session: AuthSession): void {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
    localStorage.removeItem(AUTH_SESSION_KEY);
}
