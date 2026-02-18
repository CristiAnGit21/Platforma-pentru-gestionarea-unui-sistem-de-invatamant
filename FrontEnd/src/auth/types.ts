export type Role = "ADMIN" | "PROFESOR" | "ELEV";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface AuthSession {
    token: string;
    user: User;
}
