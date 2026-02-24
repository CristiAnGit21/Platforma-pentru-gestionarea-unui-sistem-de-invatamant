/**
 * devStorage.ts
 *
 * A port-independent key/value store backed by sessionStorage.
 *
 * Why sessionStorage instead of localStorage?
 *  - sessionStorage is tab-local: two tabs on different ports (5173 vs 5174)
 *    do NOT share sesssionStorage, so there is never a cross-port conflict.
 *  - Within the SAME tab, sessionStorage IS shared across same-origin navigation
 *    (SPA route changes, window.location.assign to same origin, page reloads).
 *  - Unlike window.name, sessionStorage is not wiped by same-origin navigations.
 *  - Unlike localStorage, sessionStorage won't bleed between two dev-server ports
 *    if the developer ever opens both in the same browser profile.
 *
 * Why not window.name?
 *  - window.name is wiped whenever the browser navigates between origins.
 *  - In this project, LogIn.tsx uses window.location.assign() which triggers a
 *    full navigation and resets window.name before dashboard/students loads.
 *
 * Storage layout (each key stored individually under its own sessionStorage key):
 *   sessionStorage["utm_students_v1"]     = JSON string
 *   sessionStorage["utm_pending_users_v1"] = JSON string
 *   …etc.
 */

/** Retrieve a value by key. Returns `fallback` if the key is absent or unparseable. */
export function devGet<T>(key: string, fallback: T): T {
    try {
        const raw = sessionStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

/** Write a value by key. */
export function devSet<T>(key: string, value: T): void {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // sessionStorage full or unavailable — fail silently.
    }
}

/** Remove a key from the store. */
export function devRemove(key: string): void {
    try {
        sessionStorage.removeItem(key);
    } catch {
        // fail silently
    }
}
