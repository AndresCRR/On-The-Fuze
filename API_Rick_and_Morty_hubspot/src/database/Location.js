const DB = require("./db.json");
const hubspot = require('@hubspot/api-client');
const data_key = require('../database/private.json');

const hubspotClient = new hubspot.Client({ accessToken: data_key.key });

const url_location = "https://rickandmortyapi.com/api/location"
let locations;

functionLocations(url_location).then(data => locations = data);


const getAllLocations = () => {
    return locations;
};

const getCreateCompany = async (locations) => {
    const createLocations = await createCompany(locations);
    return createLocations;
};

const postCreateUpdateCompany = (locationPropierties) => {
    const { location_id, name, location_type, dimension, creation_date } = locationPropierties;
    const locationNewUpdate = [];
    let aux = 'new';
    if (location_id.value && name.value && location_type.value && dimension.value && creation_date.value) {
        locations.map((location) => {
            if (location.location_id == location_id.value) {
                aux = 'update';
                location.name = name.value;
                location.location_type = location_type.value;
                location.dimension = dimension.value;
                location.creation_date = creation_date.value;
                console.log("\nlocation: \n", location);
                locationNewUpdate.push(location);
            }
        });
        if (aux == 'new') {
            const newLocation = {
                "character_id": location_id.value,
                "name": name.value,
                "location_type": location_type.value,
                "dimension": dimension.value,
                "creation_date": creation_date.value
            };
            locations.push(newLocation);
            locationNewUpdate.push(newLocation);
            // res.send('create a new location');
        } else {
            // res.send('update location');
        }
    }
    return locationNewUpdate;
}

function arrayIdLocation(total_location) {
    const array_location = [];
    for (let i = 1; i <= total_location; i++) {
        array_location.push(i);
    }
    return array_location
}

async function functionLocations(url) {
    const firstResponse = await fetch(url);
    const firstLocations = await firstResponse.json();
    const total_location = firstLocations.info.count;
    const endpointlocation = arrayIdLocation(total_location);
    const response = await fetch(url + '/' + endpointlocation);
    const locations = await response.json();

    const data = locations.map((location) => {
        return {
            "location_id": location.id,
            "name": location.name,
            "location_type": location.type,
            "dimension": location.dimension,
            "creation_date": location.created
        }
    });
    return data;
}

async function createCompany(companies) {
    const allCompanies = await hubspotClient.crm.companies.getAll(undefined, undefined, ["name", "location_id"]);
    const companies_location_ids = [];
    const locationCreates = [];
    let aux = 0;
    allCompanies.map((data_company) => {
        companies_location_ids.push(data_company.properties.location_id);
    })
    const data = companies.map(async (company) => {
        for (let i in companies_location_ids) {
            if (companies_location_ids[i] == company.location_id) {
                aux = 1;
            }
        }
        if (aux == 1) { aux = 0; }
        else {
            const location = {
                properties: {
                    "location_id": company.location_id,
                    "name": company.name,
                    "location_type": company.location_type,
                    "dimension": company.dimension,
                    "creation_date": company.creation_date,
                },
            }
            locationCreates.push(location);
            console.log("\nlocation \n", location);
            const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(location);
        }
        // console.log("\nCompany \n",company,"\n\n");
    });
    return locationCreates;
}

module.exports = {
    getAllLocations,
    getCreateCompany,
    postCreateUpdateCompany
};