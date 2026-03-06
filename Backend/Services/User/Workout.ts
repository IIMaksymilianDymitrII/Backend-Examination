import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../DB/mongo";
import { type Sets, type WorkoutCatalog } from "Backend/Types/gym";
import type { InsertOneResult } from "mongodb";

export async function getAllWorkoutSerivce(
  reply: FastifyReply,
  user_id: number,
) {
  const collection = await db.collection("workout_catalog");
  const result = await collection.find({ user_id: user_id }).toArray();

  if (result.length === 0) {
    return reply.status(404).send({ message: "No Workout Found" });
  }

  return result;
}

export async function createWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
  exercise_list: Sets[],
  total_workout_volume: number,
) {
  const collection = await db.collection("workout_catalog");
  if (!title || title.trim() === "") {
    reply.status(400).send({ error: "Title is required" });
    throw new Error("Title is required")
  }
  if (
    exercise_list.length === 0 ||
    !exercise_list ||
    !Array.isArray(exercise_list)
  ) {
    return reply
      .status(400)
      .send({ error: "At Least One Exercise is Required" });
  }

  const newWorkout = {
    title,
    creator_id: user_id,
    exercise_list,
    total_workout_volume,
  };
  const result = await collection.insertOne(<WorkoutCatalog>newWorkout);

  return [result, newWorkout] as [InsertOneResult<Document>, WorkoutCatalog];
}

export async function deleteWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
) {
  
  const collection = await db.collection("workout_catalog");

  if (!title || title === "")
    return reply.status(401).send({ error: "Workout title is required" });

  const result = await collection.deleteMany({
    id: user_id,
    title: title,
  });
  if (result.deletedCount === 0)
    return reply.status(404).send({ error: "Workout not found" });
}
export async function updateWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
  typeOfChange: string ,
  changedData: string | number,
  ) {
  
  const collection = await db.collection("workout_catalog");
   const result = await collection.updateOne(
     { user_id: user_id, title: title },
     {
       $set: { [typeOfChange]: changedData },
     },
   );
 
   if (result.matchedCount === 0) {
     reply.status(404).send({ message: "No Workout Found" });
   }
}