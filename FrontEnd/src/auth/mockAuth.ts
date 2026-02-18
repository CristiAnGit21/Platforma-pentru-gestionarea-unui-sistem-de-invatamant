import type { AuthSession, User } from "./types";

const MOCK_PASSWORD = "1234";

const MOCK_USERS: User[] = [
    { id: "1", name: "Admin", email: "admin@test.com", role: "ADMIN" },
    { id: "2", name: "Profesor", email: "profesor@test.com", role: "PROFESOR" },
    { id: "3", name: "Elev", email: "elev@test.com", role: "ELEV" },
];

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(email: string, password: string): Promise<AuthSession> {
    const waitMs = 300 + Math.floor(Math.random() * 201);
    await delay(waitMs);

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user || password !== MOCK_PASSWORD) {
        throw new Error("Email sau parolă incorectă");
    }

    return { token: "mock.jwt.token", user };
}
