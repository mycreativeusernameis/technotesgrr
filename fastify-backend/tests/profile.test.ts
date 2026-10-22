import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify'
import { buildApplication } from '../src/application.ts'

describe("GET /api/@me", () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = buildApplication();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("Returns 401 when the user is not authenticated", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/api/@me"
        });

        expect(response.statusCode).toBe(401);
        expect(response.json()).toEqual({
            error: "Unauthorized"
        });
    });
});
