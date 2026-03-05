import { type FastifyReply, type FastifyRequest } from "fastify";
import type { TokenPayLoad } from "Backend/Types/jwt";

export async function generateToken(
  id: string,
  role: string,
  reply: FastifyReply,
) {
  const accessToken = await reply.jwtSign(
    { id: id,  role: role, type: "access" },
    { expiresIn: "1h" },
  );
  const refreshToken = await reply.jwtSign(
    { id: id, role: role, type: "refresh" },
    { expiresIn: "30d" },
  );
  
  reply.setCookie("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })
  reply.setCookie("refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })
  
  return { accessToken, refreshToken };
}
export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { refresh_token } = request.body as { refresh_token: string };
  if (!refresh_token) {
    return reply.status(401).send({ message: "No Refresh Token" });
  }

  const decoded = await request.jwtVerify<TokenPayLoad>();
  if (decoded.type !== "refresh") {
    return reply.status(401).send({ message: "Not Authorrized" });
  }

  const tokens = await generateToken(
    decoded.user_id,
    decoded.role,
    reply,
  );
  return reply.status(200).send(tokens);
}

export async function findUser(
  type: string,
  verificationData: string,
  request: FastifyRequest
) {
  const userQuery: string = `SELECT * FROM users WHERE ${type} = $1`;
  const result = await request.server.pg.query(userQuery, [verificationData]);

  if (result.rows.length === 0){
    const error: any = new Error("No User Found")
    error.statusCode= 401
    throw error
  }

 return result.rows[0];
}

export async function deleteAccount(userId: string, request: FastifyRequest) {
  const deleteQuery = `DELETE FROM users WHERE id = $1`
  await request.server.pg.query(deleteQuery, [userId])
}