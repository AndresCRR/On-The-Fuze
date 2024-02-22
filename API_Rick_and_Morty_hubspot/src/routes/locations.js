const {Router} = require('express');
const router = Router();
const _ = require('underscore');
// const fetch = require('node-fetch');
// const { route } = require('.');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'pat-na1-39ec74a2-7552-4bef-a4d2-9c65301ba2f3' });


let url_location = "https://rickandmortyapi.com/api/location"

async function createCompany(companies){
    const allCompanies = await hubspotClient.crm.companies.getAll(undefined,undefined,["name","location_id"]);
    const companies_location_ids = [];
    let aux = 0;
    allCompanies.map((data_company)=>{
        companies_location_ids.push(data_company.properties.location_id);
    })
    // console.log(allCompanies);
    console.log(companies_location_ids);
    const data = companies.map(async(company)=>{
        for (let i in companies_location_ids){
            if(companies_location_ids[i] == company.location_id){
                // console.log(contacts_character_ids[i]);
                aux = 1;
            }    
        }
        if (aux == 1){aux=0;}
        else{
            const location = {
                properties:{
                    "location_id": company.location_id,
                    "name": company.name,
                    "location_type": company.location_type,
                    "dimension": company.dimension,
                    "creation_date": company.creation_date,
                },
            }
            console.log("\nlocation \n",location);
            const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(location);
        }
        // console.log("\nCompany \n",company,"\n\n");
    });
}
function arrayIdLocation(total_location){
    const array_location = [];
    for (let i = 1; i <= total_location;i++){
        array_location.push(i);
    }
    return array_location
}

async function functionLocations(url) {
    const firstResponse = await fetch(url);
    const firstLocations = await firstResponse.json();
    const total_location = firstLocations.info.count;
    const endpointlocation = arrayIdLocation(total_location);
    const response = await fetch(url+'/'+endpointlocation);
    const locations = await response.json();

    const data = locations.map((location)=>{
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

let locations; 
functionLocations(url_location).then(data => locations = data);


router.get('/', async (req,res)=>{
    res.json(locations);
    createCompany(locations);
}); 

router.post('/',(req,res)=>{
    const location_propierties = req.body.properties;
    const { location_id, name, location_type, dimension, creation_date }=location_propierties;
    console.log("id:", location_id.value);
    console.log("name:", name.value);
    console.log("location type:", location_type.value);
    console.log("dimension:", dimension.value);
    if (location_id.value && name.value && location_type.value && dimension.value && creation_date.value){
        locations.map((location)=>{
            if (location.location_id == location_id.value){
                location.name = name.value;
                location.location_type = location_type.value;
                location.dimension = dimension.value;
                location.creation_date = creation_date.value;
                console.log("\n\n\nlocation: \n", location);
            }
        });
    }
    // if (name && location_type && dimension && creation_date){
    //     const id = locations.length + 1;
    //     const newLocation = {id,...req.body};
    //     // locations.push(newLocation);
    //     // res.json(locations);
    //     console.log(newLocation);
    // }else{
    //     res.status(500).json({error: 'There was an error.'});
    // }
    // console.log("\nreq :\n",location_propierties);
    console.log("\nEND POST LOCATION\n");
    // res.send('received');
});

router.put('/:id', (req,res)=>{
    const {id}=req.params;
    const { name, location_type, dimension, creation_date } = req.body;
    if(name && location_type && dimension && creation_date){
        _.each(locations,(location,i)=>{
            if(location.id == id){
                location.name = name;
                location.location_type = location_type;
                location.dimension = dimension;
                location.creation_date = creation_date;
            }
        });
        res.json(locations);
    }else{
        res.status(500).json({error: 'There was an error.'})
    }
});

router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    _.each(locations, (location, i) => {
        if (location.id == id){
            location.splice(i, 1);
        }
    })
    res.send(locations);
});

module.exports = router;