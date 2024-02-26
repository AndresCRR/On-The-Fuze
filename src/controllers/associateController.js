const associateService = require("../services/associateService");

const getAllAssociates = async (req, res) => {
  const allAssociatesSource = await associateService.getAllAssociates();
  res.send({
    status: "OK",
    data_source: allAssociatesSource,
  });
};

module.exports = {
  getAllAssociates,
};
