const DB = require("./db.json");
const hubspot = require("@hubspot/api-client");
const data_key = require("../database/private.json");

const hubspotClientSource = new hubspot.Client({
  accessToken: data_key.source.token,
});
const hubspotClientMirror = new hubspot.Client({
  accessToken: data_key.mirror.token,
});

const getAllAssociates = async () => {
  const { allAssociatesSource, allAssociatesMirror } =
    await associationContactCompany();
  return { allAssociatesSource, allAssociatesMirror };
  // return DB.associations;
};

async function associationContactCompany() {
  const allContactsSource = await hubspotClientSource.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "country"]
  );
  const allCompaniesSource = await hubspotClientSource.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allContactsMirror = await hubspotClientMirror.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "country"]
  );
  const allCompaniesMirror = await hubspotClientMirror.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allAssociatesSource = [];
  const allAssociatesMirror = [];

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
    const companyToAssociate = allCompaniesSource.find(
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
      await hubspotClientSource.crm.associations.v4.basicApi.create(
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
    allAssociatesSource.push(associate);
  }

  for (contact of allContactsMirror) {
    if (!contact) {
      continue;
    }
    const companiesAssociateContactMirror =
      await hubspotClientSource.crm.associations.v4.basicApi.getPage(
        "contact",
        contact.id,
        "company"
      );
    if (companiesAssociateContactMirror.results[0]) {
      continue;
    }
    const companyToAssociate = allCompaniesMirror.find(
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
      await hubspotClientSource.crm.associations.v4.basicApi.create(
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
    allAssociatesMirror.push(associate);
  }

  return { allAssociatesSource, allAssociatesMirror };
}

module.exports = { getAllAssociates };
