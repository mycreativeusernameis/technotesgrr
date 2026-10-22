import Fastify from "fastify";
import cors from "@fastify/cors";

import { createAuthPlugin } from "./plugins/auth.js";
import { createAuthRoutes } from "./modules/auth/routes.js";
import profileRoutes from "./modules/profile/routes.js";
import type { AuthInstance } from "./lib/auth/auth.js";

export function buildApplication(auth: AuthInstance) {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });

  fastify.register(createAuthRoutes(auth), {
    prefix: "/api/auth",
  });

  fastify.register((protectedApp) => {
    protectedApp.register(createAuthPlugin(auth));
    protectedApp.register(profileRoutes, {
      prefix: "/api",
    });
  });

  return fastify;
}
