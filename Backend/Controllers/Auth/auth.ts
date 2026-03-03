import { type FastifyReply, type FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  const userQuery: string = `SELECT * FROM users WHERE email = $1`;
  const result = await request.server.pg.query(userQuery, [email]);
  if (result.rows.length === 0)
    return reply.status(401).send({ message: "No User Found" });

  const user = result.rows[0];

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return reply.status(401).send({ message: "False Password" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );

  reply.status(200).send({ message: "Login Succsessful", token: token });
}

export async function googleSignin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  
}

export async function googleLogin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { google_id } = request.body as { google_id: string; };

  const userQuery: string = `SELECT * FROM users WHERE google_id = $1`;
  const result = await request.server.pg.query(userQuery, [google_id]);
  if (result.rows.length === 0)
    return reply.status(401).send({ message: "No User Found" });
  const user = result.rows[0];

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );
  reply.status(200).send({ message: "Login Succsessful", token: token });
}

export async function callback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
    
}