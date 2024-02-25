const { app } = require("../src/app");
const request = require("supertest");

describe("GET /api/v1/locations", () => {
  test("should respond whit a 200 status code", async () => {
    const response = await request(app).get("/api/v1/locations").send();
    expect(response.statusCode).toBe(200);
  });
  test("should have a content-type : application/json", async () => {
    const response = await request(app).get("/api/v1/locations").send();
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
});

describe("GET /api/v1/locations/create", () => {
  test("should respond whit a 200 status code", async () => {
    const response = await request(app).get("/api/v1/locations/create").send();
    expect(response.statusCode).toBe(200);
  });
  test("should have a content-type : application/json", async () => {
    const response = await request(app).get("/api/v1/locations/create").send();
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
});

describe("POST /api/v1/locations", () => {
  describe("When send a correct file format", () => {
    const testCompany = {
      properties: {
        location_id: "0",
        name: "test name",
        location_type: "test location",
        dimension: "test dimension",
        creation_date: "test creation",
      },
    };
    test("should respond whit a 201 status code", async () => {
      const response = await request(app)
        .post("/api/v1/locations")
        .send(testCompany);
      expect(response.statusCode).toBe(201);
    });
    test("should have a content-type : application/json in headers", async () => {
      const response = await request(app)
        .post("/api/v1/locations")
        .send(testCompany);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("application/json")
      );
    });
    test("should respond whit an data", async () => {
      const response = await request(app)
        .post("/api/v1/locations")
        .send(testCompany);
      expect(response.body.data).toBeDefined();
    });
  });
  describe("When send an empty file", () => {
    test("should respond whit a 400 status code", async () => {
      const response = await request(app).post("/api/v1/locations").send();
      expect(response.statusCode).toBe(400);
    });
  });
  describe("When send an file whit pending a properties", () => {
    const testCompany = { propierties: {} };
    test("should respond whit a 400 status code", async () => {
      const response = await request(app)
        .post("/api/v1/locations")
        .send(testCompany);
      expect(response.statusCode).toBe(400);
    });
  });
});
