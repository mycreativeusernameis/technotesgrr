import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

import type { FastifyInstance } from "fastify";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import type { TestHelpers } from "better-auth/plugins";
import { createAuth } from "../src/lib/auth/auth.js";
import { createTestAuth } from "./helpers/auth.js";
import { getSqlitePath } from "../src/lib/database/config.js";
import { buildApplication } from "../src/application.js";

type SignUpResponse = {
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

let app: FastifyInstance;
let test: TestHelpers;

beforeAll(async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Tests must run with NODE_ENV=test");
  }

  const databasePath = getSqlitePath();

  mkdirSync(dirname(databasePath), { recursive: true });

  // Auth instance που χρησιμοποιεί η εφαρμογή.
  const appAuth = createAuth(databasePath);

  // Ξεχωριστό instance μόνο για τα test utilities.
  const testAuth = createTestAuth(databasePath);

  test = (await testAuth.$context).test;

  app = buildApplication(appAuth);

  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /api/@me", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/@me",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({
      error: "Unauthorized",
    });
  });

  it("returns the authenticated user's profile", async () => {
    const user = test.createUser({
      email: `profile-${randomUUID()}@example.com`,
    });

    const savedUser = await test.saveUser(user);

    try {
      const { headers } = await test.login({
        userId: savedUser.id,
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/@me",
        headers: Object.fromEntries(headers.entries()),
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        id: savedUser.id,
        email: savedUser.email,
      });
    } finally {
      await test.deleteUser(savedUser.id);
    }
  });

  it("signs up a new user successfully", async () => {
    let userId: string | undefined;

    try {
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/sign-up/email",
        payload: {
          name: "Test User",
          email: `signup-${randomUUID()}@example.com`,
          password: "Test-password-123!",
        },
      });

      const body = response.json() as SignUpResponse;
      userId = body.user?.id;

      expect(response.statusCode).toBe(200);
      expect(body.user).toMatchObject({
        name: "Test User",
      });
      expect(body.user?.email).toMatch(/^signup-.+@example\.com$/);
    } finally {
      if (userId) {
        await test.deleteUser(userId);
      }
    }
  });

  it("rejects duplicate email registration", async () => {
    let userId: string | undefined;

    const payload = {
      name: "Test User",
      email: `duplicate-${randomUUID()}@example.com`,
      password: "Test-password-123!",
    };

    try {
      const firstResponse = await app.inject({
        method: "POST",
        url: "/api/auth/sign-up/email",
        payload,
      });

      const firstBody = firstResponse.json() as SignUpResponse;
      userId = firstBody.user?.id;

      expect(firstResponse.statusCode).toBe(200);
      expect(userId).toBeDefined();

      const duplicateResponse = await app.inject({
        method: "POST",
        url: "/api/auth/sign-up/email",
        payload,
      });

      expect(duplicateResponse.statusCode).toBe(422);
    } finally {
      if (userId) {
        await test.deleteUser(userId);
      }
    }
  });
});
