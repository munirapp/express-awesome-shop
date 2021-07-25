const fs = require("fs");
const path = require("path");
const container = require("../../../src/providers/container");
const mockDir = path.join(__dirname + "/mocks/modules");
const express = require("express");
const request = require("supertest");

describe("Testing all functional container", () => {
  beforeAll(() => {
    fs.mkdirSync(mockDir);
    fs.mkdirSync(`${mockDir}/v1`);
    fs.mkdirSync(`${mockDir}/v2`);
    fs.mkdirSync(`${mockDir}/v1/users`);
    fs.mkdirSync(`${mockDir}/v2/users`);
  });

  afterAll(() => {
    fs.rmSync(mockDir, { recursive: true, force: true });
  });

  test("It must get list of structure module directory", async () => {
    const modulesPath = `${mockDir}/modules`;

    const expectedListStructure = [
      {
        path: "v1",
        directory: `${modulesPath}/v1`,
        child: [
          { path: "users", directory: `${modulesPath}/v1/users`, child: null },
        ],
      },
      {
        path: "v2",
        directory: `${modulesPath}/v2`,
        child: [
          { path: "users", directory: `${modulesPath}/v2/users`, child: null },
        ],
      },
    ];

    const listStructure = await container.getStructureModule(modulesPath);

    expect(listStructure).toEqual(expectedListStructure);
  });

  describe("Testing all endpoint modules", () => {
    let listStructure, apiRoutes, app;

    beforeAll(async () => {
      listStructure = await container.getStructureModule(mockDir);
      apiRoutes = await container.setRouteModule(listStructure);
      app = express();
      app.use("/api", apiRoutes);
    });

    test("It must result 200 and text hello world when hit endpoint v1/users", () => {
      return request(app)
        .get("/", "/api/v1/users")
        .expect(200)
        .expect("hello world");
    });
  });
});
