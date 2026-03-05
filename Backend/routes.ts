import { type FastifyInstance, type FastifyPluginOptions } from "fastify";

import * as exerciseCtrls from "./Controllers/Gym/User/Exercise";
import * as workoutCtrls from "./Controllers/Gym/User/Workout";
import * as bodyWeighLogstCtrls from "./Controllers/Gym/User/BodyWeightLogs";

import * as exerciseAdminCtrls from "./Controllers/Gym/Admin/Exercise"

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  
  server.post("/exercises", exerciseAdminCtrls.createExerciseToCatalog);
  server.delete("/exercises/:id", exerciseAdminCtrls.deleteExerciseFromCatalog);
  server.get("/exercises", exerciseCtrls.getAllExercises);
  server.get("/exercise/:exerciseId", exerciseCtrls.getExercise);

  server.post("/sets", exerciseCtrls.createSet);
  server.delete("/sets/:id", exerciseCtrls.removeSet);
  server.get("/sets", exerciseCtrls.getAllSets);
  server.get("/sets/:setId", exerciseCtrls.getSet);

  server.post("/body-weight-log", bodyWeighLogstCtrls.createBodyWeightLog);
  server.delete("/tracked-day/:id", trackingControllers.deleteTrackedDay);
  server.get("/tracked-days", bodyWeighLogstCtrls.getAllBodyWeightLogs);
  server.get("/body-weight-log/:id", bodyWeighLogstCtrls.getBodyWeightLog);

  server.post( "/workout", workoutCtrls.createWorkout);
  server.get( "/workout/:id", workoutCtrls.getWorkout);
  server.get("/workouts", workoutCtrls.getAllWorkouts);
  server.delete("/workouts/:id", workoutCtrls.deleteWorkout);

}
export default routes;