const Associate = require("../database/Associate");

const getAllAssociates = async () => {
  const { allAssociatesSource, allAssociatesMirror } =
    await Associate.getAllAssociates();
  return { allAssociatesSource, allAssociatesMirror };
};

module.exports = {
  getAllAssociates,
};
