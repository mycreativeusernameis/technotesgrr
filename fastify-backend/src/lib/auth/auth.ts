import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export function createAuth(databasePath = "./sqlite.db") {
    return betterAuth({
        baseURL: "http://localhost:3000",
        database: new Database(databasePath),
        emailAndPassword: {
            enabled: true,
        },
        trustedOrigins: ["http://localhost:5173"],
    });
}

export type AuthInstance = ReturnType<typeof createAuth>;
export const auth = createAuth();
