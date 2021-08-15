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
    // Check if directory child's type is directory or not
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
        const handler = fs.readdirSync(`${rootDir}/${dir}`);
        arr.push({
          params: dir,
          handler: handler[0],
        });
      } else {
        arr.push({
          path: dir,
          child: recGetArrayTreeModule(`${rootDir}/${dir}`),
        });
      }
    } else {
      arr.push({ params: null, handler: path.basename(`${rootDir}/${dir}`) });
    }
  });

  return arr;
};

const recNormalizeRoutes = (
  arrTree,
  arrRoute = [],
  defaultRoot = "",
  defaultMethod = ""
) => {
  arrTree.forEach((item) => {
    if (item.path) {
      recNormalizeRoutes(item.child, arrRoute, `${defaultRoot}/${item.path}`);
    } else if (item.method) {
      recNormalizeRoutes(item.endpoint, arrRoute, defaultRoot, item.method);
    } else if (item.handler) {
      arrRoute.push({
        route: item.params ? `${defaultRoot}/${item.params}` : defaultRoot,
        method: defaultMethod,
        handler: item.handler,
      });
    } else {
      throw new Error("Wrong array tree format");
    }
  });

  return arrRoute;
};

module.exports = { recGetArrayTreeModule, recNormalizeRoutes };
