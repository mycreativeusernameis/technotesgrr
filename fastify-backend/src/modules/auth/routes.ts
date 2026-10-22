import type { FastifyInstance } from "fastify";
import { createAuthController } from "./controller.js";
import type { AuthInstance } from "../../lib/auth/auth.js";

export function createAuthRoutes(auth: AuthInstance) {
  const authController = createAuthController(auth);

  return async function authRoutes(fastify: FastifyInstance) {
    fastify.route({
      method: ["GET", "POST"],
      url: "/*",
      handler: authController,
    });
  };
}
