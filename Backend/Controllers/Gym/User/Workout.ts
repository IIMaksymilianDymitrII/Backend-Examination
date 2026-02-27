import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";
import { type Sets, type WorkoutCatalog } from "Backend/Types/gym";

export async function getAllWorkouts(reply: FastifyReply) {
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

export async function createWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { title, creator_id, exercise_list, total_workout_volume } = request.body as {
      title: string;
      creator_id: number;
      exercise_list: Sets[];
      total_workout_volume: number;
    };

    const collection = await db.collection("workout_catalog");

    if (!title || title.trim() === "") {
      return reply.status(400).send({ error: "Title is required" });
    }
    if (!creator_id) {
      return reply.status(400).send({ error: "You need to be a User" });
    }
    if (exercise_list.length === 0 || !exercise_list || !Array.isArray(exercise_list)) {
      return reply
        .status(400)
        .send({ error: "At Least One Exercise is Required" });
    }

    const newWorkout = {
      title,
      creator_id,
      exercise_list,
      total_workout_volume,
    };
    const result = await collection.insertOne(<WorkoutCatalog>newWorkout);

    return reply.status(200).send({
      _id: result.insertedId,
      newExercise: newWorkout,
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to create an exercise",
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

    const result = await collection.deleteMany({ title: workout });

    if (result.deletedCount === 0) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    return reply.status(200).send({ message: "Workout deleted", workout });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to delete workout",
      message: (err as Error).message,
    });
  }
}
