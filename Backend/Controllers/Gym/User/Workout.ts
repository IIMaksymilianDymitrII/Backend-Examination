import { type FastifyReply, type FastifyRequest } from "fastify";
import { db } from "../../../DB/mongo";
import { type Sets, type WorkoutCatalog } from "Backend/Types/gym";
import * as workoutService from "../../../Services/User/Workout";

export async function getAllWorkouts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = await request.jwtVerify<{ id: number }>();
  const result = await workoutService.getAllWorkoutSerivce(reply, decoded.id);

  return reply.status(200).send(result);
}

export async function createWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, exercise_list, total_workout_volume } = request.body as {
    title: string;
    exercise_list: Sets[];
    total_workout_volume: number;
  };

  const decoded = await request.jwtVerify<{ id: number }>();

  const [result, newWorkout] = await workoutService.createWorkoutService(
    reply,
    decoded.id,
    title,
    exercise_list,
    total_workout_volume,
  );

  return reply.status(201).send({
    _id: result.insertedId,
    newWorkout,
  });
}

export async function deleteWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = await request.jwtVerify<{ id: number }>();
  const { title } = request.params as { title: string };

  await workoutService.deleteWorkoutService(reply, decoded.id, title);

  return reply.status(200).send({ message: "Workout deleted", title });
}

export async function updateWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = await request.jwtVerify<{ id: number }>();

  const { title, typeOfChange, changedData } = request.body as {
    title: string;
    typeOfChange: string;
    changedData: string | number;
  };

  const result = workoutService.updateWorkoutService(
    reply,
    decoded.id,
    title,
    typeOfChange,
    changedData,
  );

  return reply.status(200).send(result);
}

export async function getWorkout(request: FastifyRequest, reply: FastifyReply) {
  const decoded = await request.jwtVerify<{ id: number }>();
  const { title } = request.params as { title: string };

  const collection = await db.collection("workout_catalog");
  const result = await collection.findOne({
    user_id: decoded.id,
    title: title,
  });

  if (!result) {
    reply.status(404).send({ message: "No Workout Found" });
  }

  return reply.status(200).send(result);
}
