export const MuscleGroupsSchema = { type: "string" };
export const EquipmentsSchema = { type: "string" };

export const ExerciseCatalogSchema = {
  type: "object",
  required: ["name", "equipment", "muscleGroups"],
  properties: {
    name: { type: "string" },
    equipment: { type: "array", items: EquipmentsSchema },
    muscleGroups: { type: "array", items: MuscleGroupsSchema },
  },
};

export const SetDetailsSchema = {
  type: "object",
  required: ["sets", "reps", "weight", "volume"],
  properties: {
    sets: { type: "number", minimum: 1 },
    reps: { type: "number", minimum: 1 },
    weight: { type: "number", minimum: 0 },
    volume: { type: "number", minimum: 0 },
  },
};

export const SetSchema = {
  type: "object",
  required: ["performance", "total_workout_volume"],
  properties: {
    name: { type: "string" },
    equipment: { type: "array", items: EquipmentsSchema },
    muscle_groups: { type: "array", items: MuscleGroupsSchema },
    performance: { type: "array", items: SetDetailsSchema },
    total_exercise_volume: { type: "number" },
  },
};

export const WorkoutCatalogSchema = {
  type: "object",
  required: ["titel", "creator_id", "exercise_list", "total_workout_volume"],
  properties: {
    title: { type: "string", minLength: 2 },
    creator_id: { type: "number" },
    exercise_list: { type: "array", items: SetSchema },
    total_workout_volume: { type: "number" },
  },
};

export const WorkoutsSchema = {
  type: "object",
  required: ["date", "user_id", "title", "exercise_list"],
  properties: {
    title: { type: "string", minLength: 2 },
    creator_id: { type: "number" },
    exercise_list: { type: "array", items: SetSchema },
    total_workout_volume: { type: "number" },
    date: { type: "string", format: "date-time" },
    user_id: { type: "number" },
    duration_minutes: { type: "number" },
  },
};

export const BodyWeightLogsSchema = {
  type: "object",
  required: ["user_id", "body_weight", "date"],
  properties: {
    user_id: { type: "number" },
    body_weight: { type: "number", minimum: 1 },
    date: { type: "string", format: "date-time" },
  },
};
