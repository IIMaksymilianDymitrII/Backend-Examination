import { type FastifyReply, type FastifyRequest } from "fastify";
import * as authServices from "../../Services/User/auth";
import * as adminAuthServices from "../../Services/Admin/auth";

// Add later a send mail for email verification
export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const result = await adminAuthServices.createUser(
    email,
    password,
    "User",
    request,
  );

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
  const user = await authServices.loginUser(email, password, request, reply);
  const token = authServices.generateToken(user.id, user.role, reply);

  reply.status(200).send({ message: "Login Succsessful", ...token });
}

export async function signout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });
  return reply.status(200).send({ message: "Logout Succsessful" });
}

export async function googleCallback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { token } =
    await request.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
      request,
    );

  const userinfo: any = await request.server.googleOAuth2.userinfo(token);
  const google_id: string = userinfo.sub;
  const email: string = userinfo.email;

  const userQuery = `SELECT * FROM users WHERE google_id = $1 OR email = $2`;
  const result = await request.server.pg.query(userQuery, [email, google_id]);

  let user;

  if (result.rows.length === 0) {
    const insertQuery = `INSERT INTO users (email, google_id) VALUES ($1,$2)`;
    const newUser = await request.server.pg.query(insertQuery, {
      email,
      google_id,
    });
    user = newUser.rows[0];
  } else {
    user = result.rows[0];

    if (!user.google_id) {
      const insertGoogleIDQuery = `UPDATE users SET google_id = $1 WHERE id = $2`;
      await request.server.pg.query(insertGoogleIDQuery, [google_id, user.id]);
    }
  }

  const tokens = await authServices.generateToken(user.id, user.role, reply);

  return reply.redirect(
    `http://localhost:3000/login-success?token=${tokens.accessToken}`,
  );
}
