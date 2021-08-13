const fs = require("fs");
const container = require("../../src/container");

describe("test container module", () => {
  describe("test function recGetArrayTreeModule", () => {
    test("function recGetArrayTreeModule should throw error when folder not existing", () => {
      expect(() => {
        container.recGetArrayTreeModule(__dirname + "/emptyFolder");
      }).toThrow("Can't get tree module from non existing folder");
    });

    test("function recGetArrayTreeModule should throw error when folder empty", () => {
      expect(() => {
        container.recGetArrayTreeModule(__dirname + "/mocks/module");
      }).toThrow("Can't get tree module from empty folder");
    });

    test("function rectGetArrayTreeModule should throw error when parameter rootDir not a folder", () => {
      expect(() => {
        fs.writeFileSync(__dirname + "/mocks/example.js", "");
        container.recGetArrayTreeModule(__dirname + "/mocks/example.js");
      }).toThrow("Can't get tree module from a non folder parameter");
    });

    afterAll(() => {
      fs.rmSync(__dirname + "/mocks/example.js");
    });
  });
});
