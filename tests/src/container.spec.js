const fs = require("fs");
const container = require("../../src/container");
const moduleMockDir = __dirname + "/mocks/module";

describe("test container module", () => {
  beforeAll(() => {
    if (!fs.existsSync(moduleMockDir)) fs.mkdirSync(moduleMockDir);

    const lsMkdir = [
      "/v1",
      "/v1/users",
      "/v1/users/get",
      "/v1/users/get/:id",
      "/v2",
      "/v2/products",
      "/v2/products/get",
    ];
    lsMkdir.forEach((pathDir) => {
      if (!fs.existsSync(moduleMockDir + pathDir))
        fs.mkdirSync(moduleMockDir + pathDir);
    });

    fs.copyFileSync(
      __dirname + "/mocks/getAllUsers.mock.js",
      moduleMockDir + "/v1/users/get/getAllUsers.js"
    );
    fs.copyFileSync(
      __dirname + "/mocks/getOneUser.mock.js",
      moduleMockDir + "/v1/users/get/:id/getOneUser.js"
    );
    fs.copyFileSync(
      __dirname + "/mocks/getAllProducts.mock.js",
      moduleMockDir + "/v2/products/get/getAllProducts.js"
    );
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
      const expectedArrayTreeModule = [
        {
          path: "v1",
          child: [
            {
              path: "users",
              child: [
                {
                  method: "get",
                  endpoint: [
                    { params: ":id", endpoint: ["getOneUser.js"] },
                    "getAllUsers.js",
                  ],
                },
              ],
            },
          ],
        },
        {
          path: "v2",
          child: [
            {
              path: "products",
              child: [
                {
                  method: "get",
                  endpoint: ["getAllProducts.js"],
                },
              ],
            },
          ],
        },
      ];

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
