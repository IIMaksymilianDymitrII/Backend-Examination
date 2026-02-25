import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes";
import fastifyPostgres from "@fastify/postgres";
import { connectMongo } from "./DB/mongo";

const app = fastify({ logger: true });

await app.register(fastifyPostgres, {
  connectionString: process.env.POSTGRES_LINK + "/users",
});
await app.register(connectMongo);
await app.register(routes);
await app.register(cors);


await app.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
  console.log(`Server is running at ${address}`);
});
