import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";

export async function getAllWorkouts(
  reply: FastifyReply,
) {
  try {
    const collection = await db.collection("workout_catalog");
    const result = await collection.find({}).toArray();

    if (result.length === 0) {
      reply.status(404).send({ message: "No Workout Found" });
    }

    return reply.status(200).send(result);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to get workouts",
      message: (err as Error).message,
    });
  }
}

export async function deleteWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { workout } = request.params as { workout: string };
    const collection = await db.collection("workout_catalog");

    if (!workout) {
      return reply.status(400).send({ error: "Workout title is required" });
    }

    const result = await collection.deleteMany({title: workout})

    if (result.deletedCount=== 0) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    return reply.status(200).send ({ message: "Workout deleted", workout })
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to delete workout",
      message: (err as Error).message,
    });
  }
}