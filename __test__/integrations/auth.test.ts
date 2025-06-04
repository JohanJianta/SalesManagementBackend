import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../src/app";

const prisma = new PrismaClient();

const registerEndpoint = "/api/auth/register";
const loginEndpoint = "/api/auth/login";
const name = "registeruser";
const email = "registertest@test.com";
const password = "registerpass";

beforeAll(async () => {
  await prisma.$connect();

  await prisma.users.deleteMany({
    where: { email },
  });
});

afterAll(async () => {
  await prisma.users.deleteMany({
    where: { email },
  });

  await prisma.$disconnect();
});

describe(`POST ${registerEndpoint}`, () => {
  it("should return 201 with newly registered user", async () => {
    const res = await request(app).post(registerEndpoint).send({
      name,
      email,
      password,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("payload");
    expect(res.body.payload).toHaveProperty("id");
    expect(res.body.payload).toHaveProperty("name");
    expect(res.body.payload).toHaveProperty("email");
    expect(res.body.payload).toHaveProperty("role");
    expect(res.body.payload.name).toBe(name);
    expect(res.body.payload.email).toBe(email);
  });

  it("should return 400 for invalid request data", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "",
      email: "",
      password: "",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 403 for forbidden roles", async () => {
    const res = await request(app).post(registerEndpoint).send({
      name,
      email,
      password,
      role: "admin",
    });

    expect(res.statusCode).toBe(403);
  });

  it("should return 409 for duplicate email", async () => {
    const res = await request(app).post(registerEndpoint).send({
      name,
      email,
      password,
    });

    expect(res.statusCode).toBe(409);
  });
});

describe(`POST ${loginEndpoint}`, () => {
  it("should return 200 with valid credentials", async () => {
    const res = await request(app).post(loginEndpoint).send({
      email,
      password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 with invalid credentials", async () => {
    const res = await request(app).post(loginEndpoint).send({
      email: "wrongemail@test.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(401);
  });
});
