const {Router} = require('express');
const router = Router();
const _ = require('underscore');
// const fetch = require('node-fetch');
// const { route } = require('.');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'pat-na1-39ec74a2-7552-4bef-a4d2-9c65301ba2f3' });


let url_location = "https://rickandmortyapi.com/api/location"

async function createCompany(companies){
    const data = companies.map(async(company)=>{
        const location = {
            properties:{
                "location_id": company.id,
                "name": company.name,
                "location_type": company.location_type,
                "dimension": company.dimension,
                "creation_date": company.creation_date,
            },
        }
        console.log("\nlocation \n",location);
        console.log("\nCompany \n",company,"\n\n");
        const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(location);
    });
}

async function functionLocations(url) {
    const response = await fetch(url);
    const locations = await response.json();

    const data = locations.results.map((location)=>{
        return {
            "id": location.id,
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
    res.send(locations);
    createCompany(locations);
}); 

router.post('/',(req,res)=>{
    const { name, location_type, dimension, creation_date }=req.body;
    if (name && location_type && dimension && creation_date){
        const id = locations.length + 1;
        const newLocation = {id,...req.body};
        // locations.push(newLocation);
        // res.json(locations);
        console.log(newLocation);
    }else{
        res.status(500).json({error: 'There was an error.'});
    }
    console.log("\nreq :\n",req.body);
    res.send('received');
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