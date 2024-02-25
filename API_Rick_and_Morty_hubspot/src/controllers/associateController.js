const associateService = require("../services/associateService");

const getAllAssociates = async (req, res) => {
  const allAssociates = await associateService.getAllAssociates();
  res.send({ status: "OK", data: allAssociates });
};

module.exports = {
  getAllAssociates,
};
