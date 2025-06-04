import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../src/app";

const prisma = new PrismaClient();

const endpoint = "/api/products";
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
  it("should return 200 with list of product data", async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("products");
    expect(Array.isArray(res.body[0].products)).toBe(true);
    expect(res.body[0].products[0]).toHaveProperty("units");
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(endpoint).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });
});

describe(`GET ${endpoint}/{id}`, () => {
  let product_id: number;

  beforeAll(async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    product_id = res.body[0].id;
  });

  it("should return 200 with specific product data", async () => {
    const res = await request(app).get(`${endpoint}/${product_id}`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("default_price");
    expect(res.body).toHaveProperty("corner_price");
    expect(res.body).toHaveProperty("product_images");
    expect(res.body).toHaveProperty("product_units");
    expect(res.body).toHaveProperty("product_features");
    expect(res.body).toHaveProperty("product_specifications");
    expect(res.body).toHaveProperty("cluster_ref");
  });

  it("should return 400 for invalid id", async () => {
    const res = await request(app).get(`${endpoint}/abc`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(`${endpoint}/${product_id}`).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(app).get(`${endpoint}/0`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
