const {Router} = require('express');
const router = Router();

const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'pat-na1-39ec74a2-7552-4bef-a4d2-9c65301ba2f3' });

async function associationContactCompany(){
    const allCompanies = await hubspotClient.crm.companies.getAll(undefined,undefined,["name","location_id"]);
    const allContacts = await hubspotClient.crm.contacts.getAll(undefined,undefined,["country"]);
    allContacts.map(async(contact)=>{
        allCompanies.map(async(company)=>{
            if (contact.properties.country===company.properties.name){
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

router.get('/', (req,res)=>{   
    res.send("Association company to contact");
    associationContactCompany();
}); 

module.exports = router;