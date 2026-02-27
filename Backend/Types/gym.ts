export type Equipments = string[];
export type MuscleGroups = string[];

export type ExerciseCatalog = {
  name: string;
  equipment: Equipments;
  muscleGroups: MuscleGroups;
};

export type SetDetails = {
  sets: number;
  reps: number;
  weight: number;
  volume: number;
};

export type Exercises = ExerciseCatalog & SetDetails;

export type WorkoutCatalog = {
  title: string;
  creator_id: number; // postgres ID
  exercise_list: Exercises[];
  total_workout_volume: number;
};

export type Workouts = WorkoutCatalog & {
  date: Date;
  user_id: number;
  duration_minutes?: number;
};

export type BodyWeightLogs = {
  user_id: number;
  body_weight: number;
  date: Date;
};
