import fastify, {
  type FastifyError,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import fastifyPostgres from "@fastify/postgres";
import fastifyHelmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { connectMongo } from "./DB/mongo";

const app = fastify({ logger: true });

// HTTP Security Headers
await app.register(fastifyHelmet);
await app.register(rateLimit, {
  max: 200,
  timeWindow: "3 mintues",
});
await app.register(cors);

await app.register(fastifyPostgres, {
  connectionString: process.env.POSTGRES_LINK + "/users",
});
await app.register(connectMongo);

await app.register(routes);

// Global Error Handler
app.setErrorHandler(
  (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation Failed",
        details: error.validation,
      });
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ message: error.message });
    }
    request.log.error(error);
    reply.status(500).send({ message: "Something Went Wrong" });
  },
);
// Not Found (404) Handler
app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
  request.log.warn(
    `Route has not been found: ${request.method}:${request.url}`,
  );
  reply.status(404).send({
    error: "Not Found",
    message: `Route ${request.method}:${request.url} dose not exist`,
  });
});

try {
  await app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
