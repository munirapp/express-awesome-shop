const fs = require("fs");
const path = require("path");
const container = require("../../src/providers/container");
const mockDir = path.join(__dirname + "/mocks");

describe("Testing all functional container", () => {
  beforeAll(() => {
    fs.mkdirSync(mockDir);
    fs.mkdirSync(`${mockDir}/modules`);
    fs.mkdirSync(`${mockDir}/modules/v1`);
    fs.mkdirSync(`${mockDir}/modules/v2`);
    fs.mkdirSync(`${mockDir}/modules/v1/users`);
    fs.mkdirSync(`${mockDir}/modules/v2/users`);
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
});
