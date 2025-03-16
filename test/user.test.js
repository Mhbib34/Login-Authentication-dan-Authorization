import supertest from "supertest";
import { createTestUser, removeTestUser } from "./test.util.js";
import { web } from "../src/application/web.js";

describe("POST /auth/register", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("Should can create new user", async () => {
    const result = await supertest(web).post("/auth/register").send({
      username: "test",
      name: "test",
      password: "rahasia",
      email: "test@gmail.com",
    });

    expect(result.status).toBe(200);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.name).toBe("test");
    expect(result.body.user.password).toBeUndefined();
    expect(result.body.user.email).toBe("test@gmail.com");
  });

  it("Should reject if request is invalid", async () => {
    const result = await supertest(web).post("/auth/register").send({
      username: "",
      name: "test",
      password: "",
      email: "",
    });

    expect(result.status).toBe(400);
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/auth/register").send({
      username: "test",
      password: "rahasia",
      name: "test",
      email: "test@gmail.com",
    });

    expect(result.status).toBe(200);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.name).toBe("test");
    expect(result.body.user.email).toBe("test@gmail.com");
    expect(result.body.user.password).toBeUndefined();

    result = await supertest(web).post("/auth/register").send({
      username: "test",
      password: "rahasia",
      name: "test",
      email: "test@gmail.com",
    });

    expect(result.status).toBe(400);
  });
});

describe("POST /auth/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });

  it("Should can login", async () => {
    const result = await supertest(web).post("/auth/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });
    expect(result.status).toBe(200);
    expect(result.body.refreshToken).toBeDefined();
    expect(result.body.refreshToken).not.toBe("test");
  });

  it("Should reject if request is invalid", async () => {
    const result = await supertest(web).post("/auth/login").send({
      email: "",
      password: "",
    });
    expect(result.status).toBe(400);
  });
});

describe("POST /auth/refresh", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("Should can refresh token", async () => {
    const login = await supertest(web).post("/auth/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    const refreshToken = login.body.refreshToken;

    const result = await supertest(web)
      .post("/auth/refresh")
      .send({ refreshToken });

    expect(result.status).toBe(200);
    expect(result.body.accessToken).toBeDefined();
  });

  it("Should reject if token is invalid", async () => {
    const login = await supertest(web).post("/auth/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    const refreshToken = "invalid_refresh_token";

    const result = await supertest(web)
      .post("/auth/refresh")
      .send({ refreshToken });

    expect(result.status).toBe(403);
  });
});

describe("GET /auth/profile", function () {
  let accessToken;

  beforeEach(async () => {
    await createTestUser();

    const loginResponse = await supertest(web)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "rahasia" });

    accessToken = loginResponse.body.accessToken;
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should can get user", async () => {
    const result = await supertest(web)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(result.status).toBe(200);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.name).toBe("test");
    expect(result.body.user.email).toBe("test@gmail.com");
  });

  it("Should reject if access token is invalid", async () => {
    const result = await supertest(web)
      .get("/auth/profile")
      .set("Authorization", `Bearer asda`);

    expect(result.status).toBe(403);
  });
});
