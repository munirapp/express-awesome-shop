module.exports = (service) => ({
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  fetch: (req, res) => {
    try {
      return service.getMessage();
    } catch (error) {
      next(error);
    }
  },
});
