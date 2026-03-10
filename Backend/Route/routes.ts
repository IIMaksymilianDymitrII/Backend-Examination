import {
  type FastifyRequest,
  type FastifyReply,
  type FastifyInstance,
  type FastifyPluginOptions,
} from "fastify";

import * as exerciseCtrls from "../Controllers/Gym/User/Exercise";
import * as workoutCtrls from "../Controllers/Gym/User/Workout";

import * as exerciseAdminCtrls from "../Controllers/Gym/Admin/Exercise";
import * as authAdmin from "../Controllers/Auth/admin";
import { refreshToken } from "Backend/Services/User/auth";

import * as gymSchema from "../Schema/Gym";
import * as authSchema from "../Schema/Auth"

import { verifyUser } from "Backend/Middleware/auth";

async function userRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const auth = (request: FastifyRequest, reply: FastifyReply) =>
    verifyUser(request, reply);
server.post("/auth/refresh", refreshToken);
  server.get(
    "/exercises",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: gymSchema.ExerciseCatalogSchema,
          },
        },
      },
      preHandler: auth,
    },
    exerciseCtrls.getAllExercises,
  );

  server.get(
    "/exercise/:exerciseId",
    {
      schema: { response: { 200: gymSchema.ExerciseCatalogSchema } },
      preHandler: auth,
    },
    exerciseCtrls.getExercise,
  );

  server.post("/sets", { preHandler: auth }, exerciseCtrls.createSet);
  server.delete("/sets/:id", { preHandler: auth }, exerciseCtrls.removeSet);
  server.get("/sets", { preHandler: auth }, exerciseCtrls.getAllSets);
  server.get("/sets/:setId", { preHandler: auth }, exerciseCtrls.getSet);

  server.post("/workout", { preHandler: auth }, workoutCtrls.createWorkout);
  server.post("/workout/:id", { preHandler: auth }, workoutCtrls.updateWorkout);
  server.get("/workout/:id", { preHandler: auth }, workoutCtrls.getWorkout);
  server.get("/workouts", { preHandler: auth }, workoutCtrls.getAllWorkouts);
  server.delete(
    "/workouts/:id",
    { preHandler: auth },
    workoutCtrls.deleteWorkout,
  );
}

async function adminRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const adminAuth = (request: FastifyRequest, reply: FastifyReply) =>
    verifyUser(request, reply, true);

  server.post(
    "/exercise",
    { preHandler: adminAuth },
    exerciseAdminCtrls.createExerciseToCatalog,
  );
  server.delete(
    "/exercises/:id",
    { preHandler: adminAuth },
    exerciseAdminCtrls.deleteExerciseFromCatalog,
  );

  server.post("/user/", { preHandler: adminAuth }, authAdmin.createAdmin);
  server.delete(
    "/user/:id",
    { preHandler: adminAuth },
    authAdmin.deleteAccount,
  );
  server.get("/user/", { preHandler: adminAuth }, authAdmin.showAllUsers);
  server.post("/user/", { preHandler: adminAuth }, authAdmin.updateAcount);
}

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  userRoutes(server, options);
  adminRoutes(server, options);
}
export default routes;
