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
import * as auth from "../Controllers/Auth/auth";
import { refreshToken } from "Backend/Services/User/auth";

import * as gymSchema from "../Schema/Gym";
import * as authSchema from "../Schema/Auth"

import { verifyUser } from "Backend/Middleware/auth";

async function userRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const authenticate = (request: FastifyRequest, reply: FastifyReply) =>
    verifyUser(request, reply);
  
  server.post("/auth/signin", auth.signin);
  server.post("/auth/login", auth.login);
  server.post("/auth/signout", auth.signout);
  server.get("/login/google/callback", auth.googleCallback);
  
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
      preHandler: authenticate,
    },
    exerciseCtrls.getAllExercises,
  );

  server.get(
    "/exercise/:exerciseId",
    {
      schema: { response: { 200: gymSchema.ExerciseCatalogSchema } },
      preHandler: authenticate,
    },
    exerciseCtrls.getExercise,
  );

  server.post("/sets", { preHandler: authenticate }, exerciseCtrls.createSet);
  server.delete("/sets/:id", { preHandler: authenticate }, exerciseCtrls.removeSet);
  server.get("/sets", { preHandler: authenticate }, exerciseCtrls.getAllSets);
  server.get("/sets/:setId", { preHandler: authenticate }, exerciseCtrls.getSet);

  server.post("/workout", { preHandler: authenticate }, workoutCtrls.createWorkout);
  server.post("/workout/:id", { preHandler: authenticate }, workoutCtrls.updateWorkout);
  server.get("/workout/:id", { preHandler: authenticate }, workoutCtrls.getWorkout);
  server.get("/workouts", { preHandler: authenticate }, workoutCtrls.getAllWorkouts);
  server.delete(
    "/workouts/:id",
    { preHandler: authenticate },
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
  server.get("/user", { preHandler: adminAuth }, authAdmin.showAllUsers);
  server.post("/user", { preHandler: adminAuth }, authAdmin.updateAcount);
}

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  userRoutes(server, options);
  adminRoutes(server, options);
}
export default routes;
