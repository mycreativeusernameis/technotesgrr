import { betterAuth } from "better-auth";
import { createAuthOptions } from "./options.js";

export function createAuth(databasePath?: string) {
    return betterAuth(createAuthOptions(databasePath));
}

export type AuthInstance = ReturnType<typeof createAuth>;
export const auth = createAuth();
