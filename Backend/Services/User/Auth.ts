import { type FastifyReply, type FastifyRequest } from "fastify";

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
  return { accessToken, refreshToken };
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
