import { type FastifyReply, type FastifyRequest } from "fastify";
import type { TokenPayLoad } from "Backend/Types/jwt";
import bcrypt from "bcrypt"

export async function loginUser(
  email: string,
  password: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = await findUser("email", email, request, reply);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return reply.status(401).send({ message: "False Password" });
  else return user;
}

export async function generateToken(
  id: string,
  role: string,
  reply: FastifyReply,
) {
  const accessToken = await reply.jwtSign(
    { id: id, role: role, type: "access" },
    { expiresIn: "1h" },
  );
  const refreshToken = await reply.jwtSign(
    { id: id, role: role, type: "refresh" },
    { expiresIn: "30d" },
  );

  reply.setCookie("accessToken", accessToken, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return { accessToken, refreshToken };
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refresh_token  = request.cookies.refreshToken
  if (!refresh_token) {
    return reply.status(401).send({ message: "No Refresh Token" });
  }

  const decoded = await request.jwtVerify<TokenPayLoad>();
  if (decoded.type !== "refresh") {
    return reply.status(401).send({ message: "Not Authorized" });
  }

  const tokens = await generateToken(decoded.user_id, decoded.role, reply);
  return reply.status(200).send(tokens);
}

export async function findUser(
  type: string,
  verificationData: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allowedTypes = ["email", "id", "google_id"];

  if (!allowedTypes.includes(type)) {
    return reply.status(400).send({ message: "Invalid Type" });
  }

  const userQuery: string = `SELECT * FROM users WHERE ${type} = $1`;
  const result = await request.server.pg.query(userQuery, [verificationData]);

  if (result.rows.length === 0) {
    return reply.status(400).send({ message: "No User Found" });
  }

  return result.rows[0];
}
