const DB = require("./db.json");
const hubspot = require("@hubspot/api-client");
const data_key = require("../database/private.json");
const character = require("./Character");

const hubspotClientSource = new hubspot.Client({
  accessToken: data_key.source.token,
});
const hubspotClientMirror = new hubspot.Client({
  accessToken: data_key.mirror.token,
});

const getAllAssociates = async () => {
  const allAssociatesSource = await associationContactCompany();
  return allAssociatesSource;
};

async function associationContactCompany() {
  const allContactsSource = await hubspotClientSource.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "character_id"]
  );
  const allCompaniesSource = await hubspotClientSource.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allCharacters = character.exportContacts();
  const allAssociatesSource = [];

  for (contact of allContactsSource) {
    if (!contact) {
      continue;
    }
    const companiesAssociateContactSource =
      await hubspotClientSource.crm.associations.v4.basicApi.getPage(
        "contact",
        contact.id,
        "company"
      );
    if (companiesAssociateContactSource.results[0]) {
      continue;
    }
    const location = await allCharacters.find(
      (character) => character.character_id == contact.properties.character_id
    );
    const companyToAssociate = allCompaniesSource.find(
      (company) => company.properties.name == location.location
    );
    if (!companyToAssociate) {
      continue;
    }
    const associate = {
      assocaites: {
        contact: {
          name:
            contact.properties.firstname + " " + contact.properties.lastname,
        },
        company: {
          name: companyToAssociate.properties.name,
        },
      },
    };
    const createAssociation =
      await hubspotClientSource.crm.associations.v4.basicApi.create(
        "companies",
        companyToAssociate.id,
        "contacts",
        contact.id,
        [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 2,
          },
        ]
      );
    allAssociatesSource.push(associate);
  }
  return allAssociatesSource;
}

module.exports = { getAllAssociates };
