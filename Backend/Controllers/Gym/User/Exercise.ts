import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";
import { type SetDetails, type Sets } from "Backend/Types/gym";

export async function getExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { exercise } = request.params as { exercise: string };
    const collection = db.collection("exercise_catalog");

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
    const collection = db.collection("exercise_catalog");
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

export async function createSet(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  try {
    const { exercise_name, sets, reps, weight } = request.body as {
      exercise_name: string;
      sets: number;
      reps: number;
      weight: number;
    };
    if (!reps || reps === 0 ) return reply.status(400).send({ error: "Reps are required" });
    if (reps >= 30) return reply.status(400).send({ error: "No more than 30 reps" });
    
    if (!sets || sets === 0 || sets>= 8){
      return reply.status(400).send({ error: "Sets are required" });
    }
    if (reps >= 10) return reply.status(400).send({ error: "No more than 10 sets" });
    if (!exercise_name || exercise_name.trim() === "") {
      return reply.status(400).send({ error: "Exercise is required" });
    }

    const CatalogCollection = db.collection("exercise_catalog");
    const collection = db.collection("sets");

    const exerciseItem = await CatalogCollection.findOne({name: exercise_name}) 
    if (!exerciseItem) {
        return reply.status(404).send({ error: "Exercise not found in catalog" });
    }

    const volumePerSet:number = reps * weight
    const totalVolume:number = volumePerSet * sets

    const newSet: Sets = {
      name: exerciseItem.name,
      equipment: exerciseItem.equipment,
      muscleGroups: exerciseItem.muscleGroups,
      performence: [
        {
          sets: sets,
          reps: reps,
          weight: weight,
          volume: volumePerSet,
        }
      ],
      total_exercise_volume: totalVolume
    };


    const result = await collection.insertOne(newSet);

    return reply.status(201).send({
      _id: result.insertedId,
      newExercise: newSet,
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({
      error: "Failed to create an exercise",
      message: (err as Error).message,
    });
  }
}
