const { Router } = require("express");

module.exports = (controller) => {
  const router = Router();

  router.get("/", controller.fetch);

  return router;
};
