const Associate = require("../database/Associate");

const getAllAssociates = async () => {
  const allAssociates = await Associate.getAllAssociates();
  return allAssociates;
};

module.exports = {
  getAllAssociates,
};
