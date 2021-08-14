const fs = require("fs");
const container = require("../../src/container");
const moduleMockDir = __dirname + "/mocks/module";
const expectedArrayTreeModule = require("./mocks/expectedArrayTreeModule.json");
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
      const arrayTreeModule = container.recGetArrayTreeModule(
        __dirname + "/mocks/module"
      );

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

  afterAll(() => {
    if (fs.existsSync(moduleMockDir))
      fs.rmSync(moduleMockDir, { recursive: true, force: true });
  });
});
