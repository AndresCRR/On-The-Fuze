const Location = require("../database/Location");

const getAllLocations = async () => {
  const allLocations = await Location.getAllLocations();
  return allLocations;
};
const postCreateUpdateCompany = async (locationPropierties) => {
  const createUpdateCompany = await Location.postCreateUpdateCompany(
    locationPropierties
  );
  return createUpdateCompany;
};

module.exports = {
  getAllLocations,
  postCreateUpdateCompany,
};
