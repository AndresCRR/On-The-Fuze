const DB = require("./db.json");
const { v4: uuidv4 } = require("uuid");
const hubspot = require("@hubspot/api-client");
const data_key = require("../database/private.json");

const hubspotClient = new hubspot.Client({ accessToken: data_key.key });

const url_location = "https://rickandmortyapi.com/api/location";
let locations;

functionLocations(url_location).then((data) => (locations = data));

const getAllLocations = () => {
  return locations;
};

const getCreateCompany = async (locations) => {
  const createLocations = await createCompany(locations);
  return createLocations;
};

const postCreateUpdateCompany = async (locationPropierties) => {
  const createUpdateCompany = await createUpdateLocations(
    locationPropierties,
    locations
  );
  return createUpdateCompany;
};

function arrayIdLocation(total_location) {
  const array_location = [];
  for (let i = 1; i <= total_location; i++) {
    array_location.push(i);
  }
  return array_location;
}

async function functionLocations(url) {
  const firstResponse = await fetch(url);
  const firstLocations = await firstResponse.json();
  const total_location = firstLocations.info.count;
  const endpointlocation = arrayIdLocation(total_location);
  const response = await fetch(url + "/" + endpointlocation);
  const locations = await response.json();

  const data = locations.map((location) => {
    return {
      location_id: location.id,
      name: location.name,
      location_type: location.type,
      dimension: location.dimension,
      creation_date: location.created,
    };
  });
  return data;
}

async function createCompany(companies) {
  if (!companies) return;
  const allCompanies = await hubspotClient.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const locationCreates = [];
  companies.map(async (company) => {
    const companieHs = allCompanies.find(
      (data_companie) =>
        data_companie.properties.location_id == company.location_id
    );
    if (!companieHs) {
      const location = {
        properties: {
          location_id: company.location_id,
          name: company.name,
          location_type: company.location_type,
          dimension: company.dimension,
          creation_date: company.creation_date,
        },
      };
      locationCreates.push(location);
      console.log("\nlocation \n", location);
      const createCompanyResponse =
        await hubspotClient.crm.companies.basicApi.create(location);
    }
  });
  return locationCreates;
}

async function createUpdateLocations(locationPropierties, locations) {
  if (!locations) return [];
  const {
    location_id,
    name,
    location_type,
    dimension,
    creation_date,
    hs_object_id,
  } = locationPropierties;
  if (location_id) {
    const locationToUpdate = locations.find(
      (location) => location.location_id == location_id.value
    );
    locationToUpdate.name = name.value;
    locationToUpdate.location_type = location_type.value;
    locationToUpdate.dimension = dimension.value;
    locationToUpdate.creation_date = creation_date.value;
    return locationToUpdate;
  } else {
    const newLocation = await createNewLocation(
      name.value,
      location_type.value,
      dimension.value,
      creation_date.value,
      hs_object_id.value
    );
    locations.push(newLocation);
    return newLocation;
  }
}

async function createNewLocation(
  name,
  location_type,
  dimension,
  creation_date,
  hs_object_id
) {
  const id = uuidv4();
  const newLocation = {
    location_id: id,
    name: name,
    location_type: location_type,
    dimension: dimension,
    creation_date: creation_date,
  };
  const BatchInputSimplePublicObjectBatchInput = {
    inputs: [
      {
        id: hs_object_id,
        properties: {
          location_id: id,
        },
      },
    ],
  };
  try {
    const apiResponse = await hubspotClient.crm.companies.batchApi.update(
      BatchInputSimplePublicObjectBatchInput
    );
    return newContact;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}

module.exports = {
  getAllLocations,
  getCreateCompany,
  postCreateUpdateCompany,
};
