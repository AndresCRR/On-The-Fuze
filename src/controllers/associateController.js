const associateService = require("../services/associateService");

const getAllAssociates = async (req, res) => {
  const { allAssociatesSource, allAssociatesMirror } =
    await associateService.getAllAssociates();
  res.send("Associate Creates");
};

module.exports = {
  getAllAssociates,
};
