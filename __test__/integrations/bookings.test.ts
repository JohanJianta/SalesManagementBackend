import { PrismaClient } from "@prisma/client";
import request from "supertest";
import app from "../../src/app";

const prisma = new PrismaClient();

const endpoint = "/api/bookings";
const name = "registeruser";
const email = "registertest@test.com";
const password = "registerpass";
let token = "";

const customer_name = "bookingcustomer";
const identification_number = "1111222233334444";
const phone = "08123456789";
const dp_price = 10000000;
const unit_id = 1;

beforeAll(async () => {
  await prisma.$connect();

  await prisma.product_units.update({
    where: { id: unit_id },
    data: { status: "ready" },
  });

  await prisma.bookings.deleteMany();

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
  await prisma.product_units.update({
    where: { id: unit_id },
    data: { status: "ready" },
  });

  await prisma.bookings.deleteMany();

  await prisma.users.deleteMany({
    where: { email },
  });

  await prisma.$disconnect();
});

describe(`POST ${endpoint}`, () => {
  it("should return 201 with newly created booking data", async () => {
    const res = await request(app).post(endpoint).set("Authorization", `Bearer ${token}`).send({
      customer_name,
      identification_number,
      phone,
      dp_price,
      unit_id,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("dp_price");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("created_at");
    expect(res.body).toHaveProperty("customer_data");
    expect(res.body).toHaveProperty("property_data");
    expect(res.body.customer_data).toHaveProperty("name");
    expect(res.body.customer_data).toHaveProperty("identification_number");
    expect(res.body.customer_data).toHaveProperty("phones");
    expect(Array.isArray(res.body.customer_data.phones)).toBe(true);
    expect(res.body.property_data).toHaveProperty("cluster");
    expect(res.body.property_data).toHaveProperty("product");
    expect(res.body.property_data).toHaveProperty("unit");
    expect(res.body.dp_price).toBe(dp_price);
    expect(res.body.status).toBe("pending");
    expect(res.body.customer_data.name).toBe(customer_name);
    expect(res.body.customer_data.identification_number).toBe(identification_number);
    expect(res.body.customer_data.phones).toContain(phone);
  });

  it("should return 400 for invalid request data", async () => {
    const res = await request(app).post(endpoint).set("Authorization", `Bearer ${token}`).send({
      customer_name: "",
      identification_number: "",
      phone: "",
      dp_price: "",
      unit_id: "",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).post(endpoint).set("Authorization", "Bearer invalid_token").send({
      customer_name,
      identification_number,
      phone,
      dp_price,
      unit_id,
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent unit_id", async () => {
    const res = await request(app).post(endpoint).set("Authorization", `Bearer ${token}`).send({
      customer_name,
      identification_number,
      phone,
      dp_price,
      unit_id: 0,
    });

    expect(res.statusCode).toBe(404);
  });

  it("should return 409 when customer_name does not match existing customer with the same identification_number", async () => {
    const res = await request(app).post(endpoint).set("Authorization", `Bearer ${token}`).send({
      customer_name: "wrongname",
      identification_number,
      phone,
      dp_price,
      unit_id,
    });

    expect(res.statusCode).toBe(409);
  });

  it("should return 409 when requested unit_id's status is not 'ready'", async () => {
    const res = await request(app).post(endpoint).set("Authorization", `Bearer ${token}`).send({
      customer_name,
      identification_number,
      phone,
      dp_price,
      unit_id,
    });

    expect(res.statusCode).toBe(409);
  });
});

describe(`GET ${endpoint}`, () => {
  it("should return 200 with list of booking data", async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("status");
    expect(res.body[0]).toHaveProperty("created_at");
    expect(res.body[0]).toHaveProperty("customer_name");
    expect(res.body[0]).toHaveProperty("property_data");
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(endpoint).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });
});

describe(`GET ${endpoint}/{id}`, () => {
  let booking_id: number;

  beforeAll(async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    booking_id = res.body[0].id;
  });

  it("should return 200 with specific booking data", async () => {
    const res = await request(app).get(`${endpoint}/${booking_id}`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("dp_price");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("created_at");
    expect(res.body).toHaveProperty("customer_data");
    expect(res.body).toHaveProperty("property_data");
  });

  it("should return 400 for invalid id", async () => {
    const res = await request(app).get(`${endpoint}/abc`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).get(`${endpoint}/${booking_id}`).set("Authorization", "Bearer invalid_token");

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent id", async () => {
    const res = await request(app).get(`${endpoint}/0`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe(`PUT ${endpoint}/{id}`, () => {
  let booking_id: number;

  beforeAll(async () => {
    const res = await request(app).get(endpoint).set("Authorization", `Bearer ${token}`);
    booking_id = res.body[0].id;
  });

  it("should return 200 with updated booking data", async () => {
    const res = await request(app).put(endpoint).set("Authorization", `Bearer ${token}`).send({
      booking_id,
      status: "completed",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("completed");
  });

  it("should return 400 for invalid request data", async () => {
    const res = await request(app).put(endpoint).set("Authorization", `Bearer ${token}`).send({
      booking_id: "",
      status: "",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid authorization", async () => {
    const res = await request(app).put(endpoint).set("Authorization", "Bearer invalid_token").send({
      booking_id,
      status: "completed",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for non-existent booking_id", async () => {
    const res = await request(app).put(endpoint).set("Authorization", `Bearer ${token}`).send({
      booking_id: 0,
      status: "completed",
    });

    expect(res.statusCode).toBe(404);
  });

  it("should return 409 when requested booking_id's status is not 'pending'", async () => {
    const res = await request(app).put(endpoint).set("Authorization", `Bearer ${token}`).send({
      booking_id,
      status: "cancelled",
    });

    expect(res.statusCode).toBe(409);
  });
});
