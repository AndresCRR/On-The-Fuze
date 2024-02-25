const DB = require("./db.json");
const hubspot = require("@hubspot/api-client");
const data_key = require("../database/private.json");

const hubspotClient = new hubspot.Client({ accessToken: data_key.key });

const getAllAssociates = async () => {
  const allAssociates = await associationContactCompany();
  return allAssociates;
  // return DB.associations;
};

async function associationContactCompany() {
  const allContacts = await hubspotClient.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "country"]
  );
  const allCompanies = await hubspotClient.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allAssociates = [];

  for (contact of allContacts) {
    if (!contact) {
      continue;
    }
    const companiesAssociateContact =
      await hubspotClient.crm.associations.v4.basicApi.getPage(
        "contact",
        contact.id,
        "company"
      );
    if (companiesAssociateContact.results[0]) {
      continue;
    }
    const companyToAssociate = allCompanies.find(
      (company) => company.properties.name == contact.properties.country
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
      await hubspotClient.crm.associations.v4.basicApi.create(
        "companies",
        companyToAssociate.id,
        "contacts",
        contact.id,
        [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 2,
            // AssociationTypes contains the most popular HubSpot defined association types
          },
        ]
      );
    console.log(createAssociation);
    allAssociates.push(associate);
  }

  return allAssociates;
}

module.exports = { getAllAssociates };
