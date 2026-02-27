import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";
import {
  type Equipments,
  type ExerciseCatalog,
  type MuscleGroups,
} from "Backend/Types/gym";

export async function createExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { name, equipment, muscleGroups } = request.body as {
      name: string;
      equipment: Equipments;
      muscleGroups: MuscleGroups;
    };

    const collection = db.collection("exercise_catalog");

    if (!name || name.trim() === "") {
      return reply.status(400).send({ error: "Name is required" });
    }
    if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
      return reply
        .status(400)
        .send({ error: "At least one equimpent is required" });
    }
    if (
      !muscleGroups ||
      !Array.isArray(muscleGroups) ||
      muscleGroups.length === 0
    ) {
      return reply
        .status(400)
        .send({ error: "At least one muscle group is required" });
    }

    const newExercise = {
      name: name,
      equipment: equipment,
      muscleGroups: muscleGroups,
    };
    const result = await collection.insertOne(<ExerciseCatalog>newExercise);

    return reply.status(200).send({
      _id: result.insertedId,
      newExercise
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to create an exercise",
      message: (err as Error).message,
    });
  }
}

export async function deleteExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { name } = request.params as { name: string };

    const collection = db.collection("exercise_catalog");

    if (!name) {
      return reply.status(400).send({ error: "Exercise name is required" });
    }

    const result = await collection.deleteMany({ name: name });

    if (result.deletedCount === 0) {
      return reply.status(404).send({ error: "Exercise not found" });
    }

    return reply.status(200).send({
      message: `Successfully deleted ${result.deletedCount}`,
      deleteCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to delete an exercise",
      message: (err as Error).message,
    });
  }
}
