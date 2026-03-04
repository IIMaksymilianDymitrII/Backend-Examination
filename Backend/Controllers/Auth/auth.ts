import { type FastifyReply, type FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import * as authServices from "../../Services/User/Auth";
import type { TokenPayLoad } from "Backend/Types/jwt";


export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  // Add later a send mail for email verification

  const salt: number = 10;
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const query: string = `INSERT INTO users 
  (email, password) VALUES ($1,$2)
  RETURNING id, email, role, created_at`;

  const result = await request.server.pg.query(query, [email, hashedPassword]);

  reply.status(201).send({
    message: "New User has been Created",
    user: result.rows[0],
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };
  const user = await authServices.createUser("email", email, request);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return reply.status(401).send({ message: "False Password" });

  const token = authServices.generateToken(
    user.id,
    user.role,
    reply,
  );

  reply.status(200).send({ message: "Login Succsessful", ...token });
}

export async function googleSignin(
  request: FastifyRequest,
  reply: FastifyReply,
) {}

export async function googleLogin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { google_id } = request.body as { google_id: string };

  // Verify if user Exist
  const user = await authServices.createUser(
    "google_id",
    google_id,
    request
  );

  const token = authServices.generateToken(
    user.id,
    user.role,
    reply,
  );
  reply.status(200).send({ message: "Login Succsessful", token: token });
}

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
  const { refresh_token } = request.body as { refresh_token: string };
  if (!refresh_token) {
    return reply.status(401).send({ message: "No Refresh Token" });
  }

  const decoded = await request.jwtVerify<TokenPayLoad>();
  if (decoded.type !== "refresh") {
    return reply.status(401).send({ message: "Not Authorrized" });
  }

  const tokens = await authServices.generateToken(
    decoded.user_id,
    decoded.role,
    reply,
  );
  return reply.status(200).send(tokens);
}


export async function callback(request: FastifyRequest, reply: FastifyReply) {

}