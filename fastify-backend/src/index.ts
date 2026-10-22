import { buildApplication } from "./application.js";
import { auth } from "./lib/auth/auth.js";

const fastify = buildApplication(auth);
const port = 3000;

fastify.listen({ port }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`server listening on ${address}`);
});
