const DB = require("./db.json");
const hubspot = require('@hubspot/api-client');
const data_key = require('../database/private.json');

const hubspotClient = new hubspot.Client({ accessToken: data_key.key });


const getAllAssociates = async () => {
    const allAssociates = await associationContactCompany();
    return allAssociates;
    // return DB.associations;
}

async function associationContactCompany() {
    const allCompanies = await hubspotClient.crm.companies.getAll(undefined, undefined, ["name", "location_id"]);
    const allContacts = await hubspotClient.crm.contacts.getAll(undefined, undefined, ["firstname", "lastname", "country"]);
    const allAssociates = [];

    for (let i in allContacts) {
        const contact = allContacts[i];
        const companiesAssociateContact = await hubspotClient.crm.associations.v4.basicApi.getPage(
            'contact',
            contact.id,
            'company',
        );
        if (!companiesAssociateContact.results[0]) {

            for (let j in allCompanies) {
                const company = allCompanies[j]
                if (contact.properties.country === company.properties.name) {
                        const associate = {
                            "assocaites": {
                                "contact": {
                                    "name": contact.properties.firstname + ' ' + contact.properties.lastname
                                },
                                "company": {
                                    "name": company.properties.name
                                }
                            }
                        }
                        console.log("\nDatabase New Associate\n");
                        console.log(associate);
                        allAssociates.push(associate);
                        const createAssociation = await hubspotClient.crm.associations.v4.basicApi.create(
                            'companies',
                            company.id,
                            'contacts',
                            contact.id,
                            [
                                {
                                    "associationCategory": "HUBSPOT_DEFINED",
                                    "associationTypeId": 2
                                    // AssociationTypes contains the most popular HubSpot defined association types
                                }
                            ]
                        );
                    // }
                }
            }
        }
    }
    return allAssociates;
}

module.exports = { getAllAssociates };