import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";

export async function getExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { exercise } = request.params as { exercise: string };

    const collection = await db.collection("exercise_catalog");

    if (!exercise || exercise === "") {
      return reply.status(400).send({ error: "Invalid Exercise" });
    }

    const result = await collection.findOne({ name: exercise });

    if (!result) {
      return reply.status(404).send({ error: "Exercise not found" });
    }

    return reply.status(200).send(result);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to Find an Exercise",
      message: (err as Error).message,
    });
  }
}
export async function getAllExercises(reply: FastifyReply) {
  try {
    const collection = await db.collection("exercise_catalog");

    const result = await collection.find({}).toArray();

    if (result.length === 0) {
      return reply.status(404).send({ error: "No Exercises found" });
    }

    return reply.status(200).send(result);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to show all exercises",
      message: (err as Error).message,
    });
  }
}
