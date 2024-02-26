const associateService = require("../services/associateService");

const getAllAssociates = async (req, res) => {
  const allAssociatesSource = await associateService.getAllAssociates();
  res.send("Associate Creates");
};

module.exports = {
  getAllAssociates,
};
