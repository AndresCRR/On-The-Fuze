const associateService = require("../services/associateService");

const getAllAssociates = async (req, res) => {
  const { allAssociatesSource, allAssociatesMirror } =
    await associateService.getAllAssociates();
  res.send({
    status: "OK",
    data_source: allAssociatesSource,
    data_mirror: allAssociatesMirror,
  });
};

module.exports = {
  getAllAssociates,
};
