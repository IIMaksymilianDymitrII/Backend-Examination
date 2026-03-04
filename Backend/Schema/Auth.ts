export const user_role = ["User", "Admin"] as const

export const UserSchema = {
  type: "object",
  required: ["email", "role", "id"],
  properties: {
    email: { type: "string", format: "email"},
    password: { type: "string", minimum:6 },
    google_id: {type: "string", nullable: true},
    role: {type: "string", enum: user_role},
    height_cm: {type: "number", minimum: 0, maximum:300},
    weight_kg: {type: "number", minimum: 0, maximum:300},
    created_at: {type: "string"},
    id: {type: "number", format: "date-time"},
  },
};