import { type FastifyReply, type FastifyRequest } from "fastify";

export async function verifyUser(
  request: FastifyRequest,
  reply: FastifyReply,
  verifyAdmin: boolean = false,
) {
  const decoded = await request.jwtVerify<{ id: string; role: string }>();
  if (verifyAdmin && decoded.role !== "Admin") {
    return reply.status(403).send({ message: "You are not Authorized" });
  }

  request.user = decoded;
}
