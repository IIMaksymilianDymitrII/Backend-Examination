import fastify, {
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";
import fastifyHelmet from "@fastify/helmet";
import fastifyJWT from "@fastify/jwt"
import fastifyOauth2, { type OAuth2Namespace } from "@fastify/oauth2";
import fastifyCookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";

import { connectMongo } from "./DB/mongo";
import routes from "./Route/routes";

const app = fastify({ logger: true });
const secret = process.env.JWT_SECRET_KEY
if (!secret) throw new Error("Set JWT_SECRET_TOKEN")

await app.register(fastifyHelmet);
await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});
await app.register(cors, {
  origin: "http://localhost:3001"
});
await app.register(fastifyJWT, {secret: secret as string})

app.setErrorHandler(
  (error: any, request: FastifyRequest, reply: FastifyReply) => {
    if (error.validation) {
      return reply.status(400).send({
        error: "Validation Failed",
        details: error.validation,
      });
    }
    if (error.code === "23505" || error.code === 11000) {
      return reply.status(400).send({
        error: "Conflict",
        message: "This data already exists"
      })
    }
    if (error.name === "CastError"){
      return reply.status(400).send({
        error: "Invalid ID",
        message: `The Provided ID is Incorrect: ${error.path}`
      })
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ 
        error: error.name,
        message: error.message });
    }
    console.log(error);
    reply.status(500).send({
      error: "Internal Server Error",
      message: "Something Went Wrong" });
  },
);
app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
  console.log(`Route has not been found: ${request.method}:${request.url}`);
  reply.status(404).send({
    error: "Not Found",
    message: `Route ${request.method}:${request.url} does not exist`,
  });
});

await app.register(fastifyCookie)

await app.register(fastifyOauth2, {
  name: "googleOAuth2",
  scope: ["profile", "email"],
  credentials:{
    client: {
      id: "CLIENT_ID",
      secret: "CLIENT_SECRET",
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION
  },
  startRedirectPath: "/login/google",
  callbackUri: "http://localhost:3001/login/google/callback"
});

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

await app.register(fastifyPostgres, {
  connectionString: process.env.POSTGRES_URI,
});
await app.register(connectMongo);

await app.register(routes);

try {
  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
