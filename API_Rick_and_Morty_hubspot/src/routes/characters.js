const {Router} = require('express');
const router = Router();
const _ = require('underscore');
// const fetch = require('node-fetch');
// const { route } = require('.');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'pat-na1-39ec74a2-7552-4bef-a4d2-9c65301ba2f3' });

let url_character = "https://rickandmortyapi.com/api/character";

async function createContac(characters){
    const data = characters.map(async(character)=>{
        const contact = {
            properties:{
                "character_id": character.id,
                "firstname": character.firstname,
                "lastname": character.lastname,
                "status_character": character.status_character,
                "character_species": character.character_species,
                "character_gender": character.character_gender,
            },
        }
        console.log(contact);
        console.log(character);
        // return contact
        const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contact);
    });
}

async function functionContacts(url) {
    const response = await fetch(url);
    const characters = await response.json();

    const data = characters.results.map((character)=>{
        const fullName = character.name.split(" ");
        let firstName = "";
        let lastname = "";
        for (let i in fullName){
            if(i == (fullName.length - 1)){
                lastname = fullName[i];
            }else{
                firstName = firstName + fullName[i] + " ";
            }
        } 
        return {
            "id": character.id,
            "firstname": firstName.trim(),
            "lastname": lastname,
            "status_character": character.status,
            "character_species": character.species,
            "character_gender": character.gender
        } 
    });
    return data;
}

let contacts; 
functionContacts(url_character).then(data => contacts = data);


router.get('/', async (req,res)=>{   
    res.send(contacts);
    createContac(contacts);
}); 



router.post('/',(req,res)=>{
    console.log("POST");
    const { properties }=req.body;
    console.log("properties:", properties);
    console.log("\n\n");
    const { firstname, lastname, status_character, character_species, character_gender } = properties;
    console.log("firstname:", firstname);
    console.log("\n\n");
    // const BatchReadInputSimplePublicObjectId = { propertiesWithHistory: ["string"], idProperty: "string", inputs: [{"id":"string"}], properties: ["string"] };
    // const archived = false;
    // async()=>{
    //     try {
    //       const apiResponse = await hubspotClient.crm.contacts.batchApi.read(BatchReadInputSimplePublicObjectId, archived);
    //       console.log(JSON.stringify(apiResponse, null, 2));
    //     } catch (e) {
    //       e.message === 'HTTP request failed'
    //         ? console.error(JSON.stringify(e.response, null, 2))
    //         : console.error(e)
    //     }
    // }
    if (firstname&& lastname && status_character && character_species && character_gender){
        const id = contacts.length + 1;
        const newCharacter = {id,...req.body};
        // contacts.push(newCharacter);
        console.log(newCharacter);
        // res.json(contacts);
    }else{
        res.status(500).json({error: 'There was an error.'});
    }
    // console.log("\nreq :\n",req.body);
    console.log("\nEND POST\n");
    // res.send('received');
});

router.put('/:id', (req,res)=>{
    const {id}=req.params;
    const { firstname, lastname, status_character, character_species, character_gender } = req.body;
    if(firstname&& lastname && status_character && character_species && character_gender){
        _.each(contacts,(contact,i)=>{
            if(contact.id == id){
                contact.firstname = firstname;
                contact.lastname = lastname;
                contact.status_character = status_character;
                contact.character_species = character_species;
                contact.character_gender = character_gender;
                // console.log(firstname)
            }
        });
        res.json(contacts);
    }else{
        res.status(500).json({error: 'There was an error.'})
    }
});

router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    _.each(contacts, (contact, i) => {
        if (contact.id == id){
            contacts.splice(i, 1);
        }
    })
    res.send(contacts);
});


module.exports = router;