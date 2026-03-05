import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";
import type { BodyWeightLogs } from "Backend/Types/gym";

export async function getBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date } = request.params as { date: string };
  const collection = db.collection("body_weight_log");

  if (!date || date === "") {
    return reply.status(400).send({ error: "Invalid Date" });
  }

  const result = await collection.findOne({ date: date });

  if (!result) {
    return reply.status(404).send({ error: "Log not found" });
  }

  return reply.status(200).send(result);
}
export async function getAllBodyWeightLogs(reply: FastifyReply) {
  const collection = db.collection("body_weight_log");
  const result = await collection.find({}).toArray();

  if (result.length === 0) {
    return reply.status(404).send({ error: "No Log found" });
  }

  return reply.status(200).send(result);
}

export async function createBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {user_id, body_weight, date} =
    request.body as {
        user_id: number,
        body_weight: number,
        date: Date
    };

  const collection = await db.collection("body_weight_log");

  if (!user_id) {
    return reply.status(400).send({ error: "You need to be a User" });
  }
  if (!body_weight|| body_weight === 0 || body_weight>= 300) {
    return reply.status(400).send({ error: "You need add your real Weight" });
  }
  if (!date) {
    return reply.status(400).send({ error: "You need pick a Date" });
  }

  const newLog = {
  user_id,
  body_weight,
  date: new Date(date),
  };
  const result = await collection.insertOne(<BodyWeightLogs>newLog);

  return reply.status(201).send({
    _id: result.insertedId,
    newExercise: newLog,
  });
}
