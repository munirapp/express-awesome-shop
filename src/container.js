const fs = require("fs");

module.exports = Object.freeze({
  recGetArrayTreeModule: (rootDir, arr = []) => {
    if (!fs.existsSync(rootDir))
      throw new Error("Can't get tree module from non existing folder");

    if (!fs.lstatSync(rootDir).isDirectory())
      throw new Error("Can't get tree module from a non folder parameter");

    const lsDir = fs.readdirSync(rootDir);

    if (!lsDir.length)
      throw new Error("Can't get tree module from empty folder");
  },
});
