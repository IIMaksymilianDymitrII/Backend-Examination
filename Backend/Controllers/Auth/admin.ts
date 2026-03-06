import { type FastifyReply, type FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import * as authServices from "../../Services/User/auth";
import * as adminAuthServices from "../../Services/Admin/auth";

export async function createAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { newUserEmail, newUserPassword } = request.body as {
    newUserEmail: string;
    newUserPassword: string;
  };

  const result = await adminAuthServices.createUser(
    newUserEmail,
    newUserPassword,
    "Admin",
    request,
  );

  reply.status(201).send({
    message: "New Admin User has been Created",
    user: result.rows[0],
  });
}

export async function updateAcount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userEmail, typeOfChange, changedData } = request.body as {
    userEmail: string;
    typeOfChange: string;
    changedData: string;
  };

  const type = typeOfChange.toLowerCase();

  if (type === "password") {
    const salt: number = 10;
    const hashedPassword: string = await bcrypt.hash(changedData, salt);

    await adminAuthServices.updateInsert(
      type,
      hashedPassword,
      userEmail,
      request,
      reply,
    );

    reply.status(201).send({
      message: "New Admin User has been Created",
    });
  }

  if (type === "role") {
    await adminAuthServices.updateInsert(
      type,
      changedData,
      userEmail,
      request,
      reply,
    );

    reply.status(201).send({
      message: `Admin has Changed ${userEmail}'s ${type}`,
    });
  } else {
    reply.status(401).send({ message: "Unclear type of change" });
  }
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userEmail } = request.body as {
    userEmail: string;
  };

  const user = await authServices.findUser("email", userEmail, request, reply);
  await adminAuthServices.deleteAccount(user.id, request, reply);

  reply
    .status(200)
    .send({ message: `${user.email} has been Successfully Deleted` });
}

export async function showAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const query: string = `SELECT * FROM users`;
  const result = await request.server.pg.query(query);

  if (result.rows.length === 0) {
    return reply.status(400).send({ message: "No User Found" });
  }
  return reply.status(200).send(result.rows);
}
