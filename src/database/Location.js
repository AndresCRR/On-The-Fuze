const DB = require("./db.json");
const { v4: uuidv4 } = require("uuid");
const hubspot = require("@hubspot/api-client");
const data_key = require("../database/private.json");
const character = require("./Character");

const hubspotClientSource = new hubspot.Client({
  accessToken: data_key.source.token,
});
const hubspotClientMirror = new hubspot.Client({
  accessToken: data_key.mirror.token,
});

let locations;

functionLocations(character.url_character).then((data) => (locations = data));

const getAllLocations = async () => {
  await createCompany(locations);
  return locations;
};

const postCreateUpdateCompany = async (locationPropierties) => {
  const createUpdateCompany = await createUpdateLocations(
    locationPropierties,
    locations
  );
  return createUpdateCompany;
};

async function functionLocations(url_character) {
  const firstResponse = await fetch(url_character);
  const firstLocations = await firstResponse.json();
  const total_location = firstLocations.info.count;
  const endpointCharacter = character.arrayPrimeNumber(total_location);
  const endpointlocation = [];
  const response = await fetch(url_character + "/" + endpointCharacter);
  const characters = await response.json();

  characters.map((character) => {
    endpointlocation.push(character.location.url);
  });
  const locationUrls = endpointlocation
    .filter((n, index) => endpointlocation.indexOf(n) === index)
    .filter((url) => url != "");
  const locations = [];
  for (locationUrl of locationUrls) {
    const res = await fetch(locationUrl);
    const location = await res.json();
    locations.push(location);
  }
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
  const allCompaniesSource = await hubspotClientSource.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allCompaniesMirror = await hubspotClientMirror.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const createCompanySource = [];
  const createCompanyMirror = [];
  companies.map(async (company) => {
    const companieHsSource = allCompaniesSource.find(
      (data_companie) =>
        data_companie.properties.location_id == company.location_id
    );
    const companieHsMirror = allCompaniesMirror.find(
      (data_companie) =>
        data_companie.properties.location_id == company.location_id
    );
    const location = {
      properties: {
        location_id: company.location_id,
        name: company.name,
        location_type: company.location_type,
        dimension: company.dimension,
        creation_date: company.creation_date,
      },
    };
    if (!companieHsSource) {
      createCompanySource.push(location);
      const createCompanyResponseSource =
        await hubspotClientSource.crm.companies.basicApi.create(location);
    }
    if (!companieHsMirror) {
      createCompanyMirror.push(location);
      const createCompanyResponseMirror =
        await hubspotClientMirror.crm.companies.basicApi.create(location);
    }
  });
  return { createCompanySource, createCompanyMirror };
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
    const responseMirror = await hubspotClientMirror.crm.companies.getAll(
      undefined,
      undefined,
      ["lastname", "firstname", "character_id"]
    );
    const companyMirror = responseMirror.find(
      (response) => response.properties.location_id == location_id.value
    );
    const locationToUpdate = locations.find(
      (location) => location.location_id == location_id.value
    );
    locationToUpdate.name = name.value;
    locationToUpdate.location_type = location_type.value;
    locationToUpdate.dimension = dimension.value;
    locationToUpdate.creation_date = creation_date.value;
    const BatchInputSimplePublicObjectBatchInput = {
      inputs: [
        {
          id: companyMirror.id,
          properties: {
            name: name.value,
            location_type: location_type.value,
            dimension: dimension.value,
            creation_date: creation_date.value,
          },
        },
      ],
    };
    try {
      const apiResponseMirror =
        await hubspotClientMirror.crm.companies.batchApi.update(
          BatchInputSimplePublicObjectBatchInput
        );
      return locationToUpdate;
    } catch (e) {
      e.message === "HTTP request failed"
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e);
    }
    return locationToUpdate;
  } else {
    const id = uuidv4();
    const newLocation = await createNewLocation(
      name.value,
      location_type.value,
      dimension.value,
      creation_date.value,
      hs_object_id.value,
      id
    );
    locations.push(newLocation);
    const location = {
      properties: {
        location_id: id,
        name: name.value,
        location_type: location_type.value || "",
        dimension: dimension.value || "",
        creation_date: creation_date.value || "",
      },
    };
    const creatNewLoactionMirror =
      await hubspotClientMirror.crm.companies.basicApi.create(location);
    return newLocation;
  }
}

async function createNewLocation(
  name,
  location_type,
  dimension,
  creation_date,
  hs_object_id,
  id
) {
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
    const apiResponse = await hubspotClientSource.crm.companies.batchApi.update(
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
  postCreateUpdateCompany,
};
