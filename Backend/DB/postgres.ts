import  { fastify } from "fastify";
import fastifyPostgres from "@fastify/postgres";

const POSTGRES_URI = process.env.POSTGRES_LINK

fastify().register(fastifyPostgres ,{
  connectionString: POSTGRES_URI+"/users",
});
