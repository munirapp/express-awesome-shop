const fs = require("fs");
const request = require("supertest");
const express = require("express");
const app = express();
const container = require("../../src/container");
const moduleMockDir = __dirname + "/mocks/module";
const expectedArrayTreeModule = require("./mocks/expectedArrayTreeModule.json");
const expectedArrayRoutes = require("./mocks/expectedArrayRoutes.json");
const lsMkdir = require("./mocks/listMakeDir.json");
const lsCopy = require("./mocks/listCopyFile.json");

describe("test container module", () => {
  beforeAll(() => {
    if (!fs.existsSync(moduleMockDir)) fs.mkdirSync(moduleMockDir);

    lsMkdir.forEach((pathDir) => {
      if (!fs.existsSync(moduleMockDir + pathDir))
        fs.mkdirSync(moduleMockDir + pathDir);
    });

    lsCopy.forEach((file) => {
      if (fs.existsSync(__dirname + file.source))
        fs.copyFileSync(
          __dirname + file.source,
          moduleMockDir + file.destination
        );
    });
  });

  describe("test function recGetArrayTreeModule", () => {
    test("function recGetArrayTreeModule should throw error when folder not existing", () => {
      expect(() => {
        container.recGetArrayTreeModule(__dirname + "/emptyFolder");
      }).toThrow("Can't get tree module from non existing folder");
    });

    test("function recGetArrayTreeModule should throw error when folder empty", () => {
      expect(() => {
        fs.mkdirSync(__dirname + "/mocks/example");
        container.recGetArrayTreeModule(__dirname + "/mocks/example");
      }).toThrow("Can't get tree module from empty folder");
    });

    test("function rectGetArrayTreeModule should throw error when parameter rootDir not a folder", () => {
      expect(() => {
        fs.writeFileSync(__dirname + "/mocks/example.js", "");
        container.recGetArrayTreeModule(__dirname + "/mocks/example.js");
      }).toThrow("Can't get tree module from a non folder parameter");
    });

    test("function recGetArrayTreeModule should return expected array tree module", () => {
      const arrayTreeModule = container.recGetArrayTreeModule(moduleMockDir);

      expect(arrayTreeModule).toMatchObject(expectedArrayTreeModule);
    });

    afterAll(() => {
      if (fs.existsSync(__dirname + "/mocks/example"))
        fs.rmSync(__dirname + "/mocks/example", {
          force: true,
          recursive: true,
        });

      if (fs.existsSync(__dirname + "/mocks/example.js"))
        fs.rmSync(__dirname + "/mocks/example.js");
    });
  });

  describe("test function recNormalizeRoutes", () => {
    test("function recNormalizeRoutes should return expected array routes", () => {
      expect(
        container.recNormalizeRoutes(expectedArrayTreeModule)
      ).toMatchObject(expectedArrayRoutes);
    });

    test("function recNormalizeRoutes should throw error when get wrong array tree format", () => {
      const wrongArrayTree = JSON.parse(
        JSON.stringify(expectedArrayTreeModule)
      );

      wrongArrayTree.push({ endpoint: null });

      expect(() => {
        container.recNormalizeRoutes(wrongArrayTree);
      }).toThrow("Wrong array tree format");
    });
  });

  describe("test function loadModulesApi", () => {
    beforeAll(() => {
      const apiRoutes = container.loadModulesApi(moduleMockDir);
      app.use("/api", apiRoutes);
    });

    it("routes api getAllUsers must have response status 200 and response body same with expected json", async () => {
      const expectedGetAllUsersResponse = [
        {
          id: 1,
          name: "Alex",
          gender: "male",
          address: { name: "St. Petersburg, New York" },
        },
      ];

      return request(app)
        .get("/api/v1/users")
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject(expectedGetAllUsersResponse);
        });
    });
  });

  afterAll(() => {
    if (fs.existsSync(moduleMockDir))
      fs.rmSync(moduleMockDir, { recursive: true, force: true });
  });
});
