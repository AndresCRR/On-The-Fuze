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
  // return DB.associations;
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
  const allContactsMirror = await hubspotClientMirror.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "character_id"]
  );
  const allCompaniesMirror = await hubspotClientMirror.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allCharacters = character.exportContacts();
  const allAssociatesSource = [];
  const allAssociatesMirror = [];

  for (contact of allContactsSource) {
    // allContactsSource.map(async (contact) => {
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
    // console.log(allCharacters);
    const location = await allCharacters.find(
      (character) => character.character_id == contact.properties.character_id
    );
    // console.log("\nlocation\n", location);
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
    // console.log(createAssociation);
    allAssociatesSource.push(associate);
    // });
  }

  // for (contact of allContactsMirror) {
  //   // allContactsMirror.map(async (contact) => {
  //   if (!contact) {
  //     return;
  //   }
  //   const companiesAssociateContactMirror =
  //     await hubspotClientSource.crm.associations.v4.basicApi.getPage(
  //       "contact",
  //       contact.id,
  //       "company"
  //     );
  //   if (companiesAssociateContactMirror.results[0]) {
  //     return;
  //   }
  //   const location = allCharacters.find(
  //     (character) => character.character_id == contact.properties.character_id
  //   );
  //   const companyToAssociate = allCompaniesMirror.find(
  //     (company) => company.properties.name == location.location
  //   );
  //   if (!companyToAssociate) {
  //     return;
  //   }
  //   const associate = {
  //     assocaites: {
  //       contact: {
  //         name:
  //           contact.properties.firstname + " " + contact.properties.lastname,
  //       },
  //       company: {
  //         name: companyToAssociate.properties.name,
  //       },
  //     },
  //   };
  //   const createAssociation =
  //     await hubspotClientMirror.crm.associations.v4.basicApi.create(
  //       "companies",
  //       companyToAssociate.id,
  //       "contacts",
  //       contact.id,
  //       [
  //         {
  //           associationCategory: "HUBSPOT_DEFINED",
  //           associationTypeId: 2,
  //           // AssociationTypes contains the most popular HubSpot defined association types
  //         },
  //       ]
  //     );
  //   // console.log(createAssociation);
  //   allAssociatesMirror.push(associate);
  //   // });
  // }

  return allAssociatesSource;
}

module.exports = { getAllAssociates };
