import { Router } from 'express'
import hubspot from '@hubspot/api-client'
import data_key from './private.json' assert { type:'json'}

const router = Router();
const hubspotClient = new hubspot.Client({ accessToken: data_key.key });

async function associationContactCompany() {
    const allCompanies = await hubspotClient.crm.companies.getAll(undefined, undefined, ["name", "location_id"]);
    const allContacts = await hubspotClient.crm.contacts.getAll(undefined, undefined, ["country"]);
    allContacts.map(async (contact) => {
        allCompanies.map(async (company) => {
            if (contact.properties.country === company.properties.name) {
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
            }
        })
    })
}

router.get('/', (req, res) => {
    res.send("Association company to contact");
    associationContactCompany();
});

export default router;