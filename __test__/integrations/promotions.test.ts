import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../src/app";

const prisma = new PrismaClient();

const endpoint = "/api/promotions";
const name = "registeruser";
const email = "registertest@test.com";
const password = "registerpass";
let token = "";

beforeAll(async () => {
  await prisma.$connect();

  await prisma.users.deleteMany({
    where: { email },
  });

  const res = await request(app).post("/api/auth/register").send({
    name,
    email,
    password,
  });
  token = res.body.token;
});

afterAll(async () => {
  await prisma.users.deleteMany({
    where: { email },
  });

  await prisma.$disconnect();
});

describe(`GET ${endpoint}`, () => {
  it("should return 200 with list of promotion data", async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("title");
    expect(res.body[0]).toHaveProperty("thumbnail_url");
    expect(res.body[0]).toHaveProperty("created_at");
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(endpoint).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });
});

describe(`GET ${endpoint}/{id}`, () => {
  let promotion_id: number;

  beforeAll(async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    promotion_id = res.body[0].id;
  });

  it("should return 200 with specific promotion data", async () => {
    const res = await request(app).get(`${endpoint}/${promotion_id}`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
    expect(res.body).toHaveProperty("thumbnail_url");
    expect(res.body).toHaveProperty("created_at");
    expect(res.body).toHaveProperty("expired_at");
    expect(res.body).toHaveProperty("cluster_id");
  });

  it("should return 400 for invalid id", async () => {
    const res = await request(app).get(`${endpoint}/abc`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(`${endpoint}/${promotion_id}`).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(app).get(`${endpoint}/0`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
