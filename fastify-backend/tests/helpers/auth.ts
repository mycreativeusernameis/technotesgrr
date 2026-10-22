import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins"

import { createAuthOptions } from "../../src/lib/auth/options.js";

export function createTestAuth(databasePath: string) {
    return betterAuth({
        ...createAuthOptions(databasePath),
        plugins: [testUtils()]
    })
}
