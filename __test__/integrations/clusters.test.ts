import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../src/app";

const prisma = new PrismaClient();

const endpoint = "/api/clusters";
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
  it("should return 200 with list of cluster data", async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("masterplan_url");
    expect(res.body).toHaveProperty("clusters");
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(endpoint).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });
});

describe(`GET ${endpoint}/{id}`, () => {
  let cluster_id: number;

  beforeAll(async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    cluster_id = res.body.clusters[0].id;
  });

  it("should return 200 with specific cluster data", async () => {
    const res = await request(app).get(`${endpoint}/${cluster_id}`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("category");
    expect(res.body).toHaveProperty("address");
    expect(res.body).toHaveProperty("is_apartment");
    expect(res.body).toHaveProperty("map_url");
    expect(res.body).toHaveProperty("products");
  });

  it("should return 400 for invalid id", async () => {
    const res = await request(app).get(`${endpoint}/abc`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(`${endpoint}/${cluster_id}`).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(app).get(`${endpoint}/0`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
