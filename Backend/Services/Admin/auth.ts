import { type FastifyReply, type FastifyRequest } from "fastify";
import bcrypt from "bcrypt";

export async function updateInsert(
  type: string,
  changedData: string,
  userEmail: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allowedTypes = ["password", "role"];

  if (!allowedTypes.includes(type)) {
    return reply.status(400).send({ message: "Invalid Type" });
  }

  const query: string = `UPDATE users SET ${type} = $1 WHERE email = $2`;
  await request.server.pg.query(query, [changedData, userEmail]);
}

export async function createUser(
  email: string,
  password: string,
  role: string,
  request: FastifyRequest,
) {
  const salt: number = 10;
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const query: string = `INSERT INTO users
    (email, password, role) VALUES ($1,$2,$3)
    RETURNING id, email, role, created_at`;

  const result = await request.server.pg.query(query, [
    email,
    hashedPassword,
    role,
  ]);
  return result;
}

export async function deleteAccount(
  userId: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteQuery = `DELETE FROM users WHERE id = $1`;
  await request.server.pg.query(deleteQuery, [userId]);

  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });
}
