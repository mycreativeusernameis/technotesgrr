import Database from "better-sqlite3";
import { getSqlitePath } from "../database/config.js";

export function createAuthOptions(databasePath = getSqlitePath()) {
  return {
    baseURL: "http://localhost:3000",
    database: new Database(databasePath),
    emailAndPassword: {
      enabled: true as const,
    },
    trustedOrigins: ["http://localhost:5173"],
  };
}
