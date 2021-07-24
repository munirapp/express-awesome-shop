const fs = require("fs");
const path = require("path");

/**
 * Get array of structure module
 * @param {String} dir module's directory
 * @returns {Array}
 */
async function getStructureModule(dir) {
  return new Promise(async (resolve, reject) => {
    fs.readdir(path.join(dir), (error, data) => {
      if (error) {
        reject(error);
      }

      if (data.length && data.length > 0) {
        resolve(
          (async () =>
            Promise.all(
              data.map(async (item) => {
                const path = item;
                const directory = `${dir}/${path}`;
                item = {
                  path,
                  directory,
                  child: await getStructureModule(directory).catch(() => null),
                };
                return item;
              })
            ))()
        );
      }

      resolve(null);
    });
  });
}

module.exports = {
  getStructureModule,
};
