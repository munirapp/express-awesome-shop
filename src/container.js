const fs = require("fs");
const path = require("path");

/**
 * Recursive Get Array Tree Module
 * @param {String} rootDir directory module
 * @param {Array} arr array tree module
 * @returns {Array} array tree module
 */
const recGetArrayTreeModule = (rootDir, arr = []) => {
  if (!fs.existsSync(rootDir))
    throw new Error("Can't get tree module from non existing folder");

  if (!fs.lstatSync(rootDir).isDirectory())
    throw new Error("Can't get tree module from a non folder parameter");

  // Read all directory child
  const lsDir = fs.readdirSync(rootDir);

  if (!lsDir.length) throw new Error("Can't get tree module from empty folder");

  // Looping directory child
  lsDir.forEach((dir) => {
    if (fs.lstatSync(`${rootDir}/${dir}`).isDirectory()) {
      // Check if directory child's name has include in list of allowed http methods
      if (["get", "post", "put", "patch", "delete"].includes(dir)) {
        arr.push({
          method: dir,
          endpoint: recGetArrayTreeModule(`${rootDir}/${dir}`),
        });
      }
      // Check if directory child's name contains ':' and defined as params
      else if (dir.includes(":")) {
        arr.push({
          params: dir,
          endpoint: recGetArrayTreeModule(`${rootDir}/${dir}`),
        });
      } else {
        arr.push({
          path: dir,
          child: recGetArrayTreeModule(`${rootDir}/${dir}`),
        });
      }
    } else {
      arr.push(path.basename(`${rootDir}/${dir}`));
    }
  });

  return arr;
};

module.exports = { recGetArrayTreeModule };
