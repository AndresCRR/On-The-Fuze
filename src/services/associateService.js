const Associate = require("../database/Associate");

const getAllAssociates = async () => {
  const allAssociatesSource = await Associate.getAllAssociates();
  return allAssociatesSource;
};

module.exports = {
  getAllAssociates,
};
