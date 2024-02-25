const Location = require("../database/Location");

const getAllLocations = () => {
  const allLocations = Location.getAllLocations();
  return allLocations;
};
const getCreateCompany = async (locations) => {
  const createCompany = await Location.getCreateCompany(locations);
  return createCompany;
};
const postCreateUpdateCompany = async (locationPropierties) => {
  const createUpdateCompany = await Location.postCreateUpdateCompany(
    locationPropierties
  );
  return createUpdateCompany;
};

module.exports = {
  getAllLocations,
  getCreateCompany,
  postCreateUpdateCompany,
};
