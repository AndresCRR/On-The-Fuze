const {Router} = require('express');
const router = Router();
const _ = require('underscore');
// const fetch = require('node-fetch');
// const { route } = require('.');
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'pat-na1-39ec74a2-7552-4bef-a4d2-9c65301ba2f3' });

let url_character = "https://rickandmortyapi.com/api/character";

async function createContact(characters){
    const allContacts = await hubspotClient.crm.contacts.getAll(undefined,undefined,["lastname","firstname","character_id"]);
    const contacts_character_ids = [];
    let aux = 0;
    allContacts.map((data_contac)=>{
        contacts_character_ids.push(data_contac.properties.character_id);
    })
    const data = characters.map(async(character)=>{
        for (let i in contacts_character_ids){
            if(contacts_character_ids[i] == character.character_id){
                // console.log(contacts_character_ids[i]);
                aux = 1;
            }    
        }
        if (aux == 1){aux=0;}
        else{
        const contact = {
            properties:{
                "character_id": character.character_id,
                "firstname": character.firstname,
                "lastname": character.lastname,
                "status_character": character.status_character,
                "character_species": character.character_species,
                "character_gender": character.character_gender
            },
        }
        console.log(contact);
        const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contact);
        }
    });
}

function arrayPrimeNumber(number){
    const array_number = [1];
    for (let n=1; n<=number; n++){
        let count = 0;
        for (let i=1;i<=n;i++){
            if (n%i === 0) count++;
        }
        if (count === 2) array_number.push(n);
    }
    return array_number
}

async function functionContacts(url) {
    // First call of characters ---> this call is to know the total characters
    const firstResponse = await fetch(url);
    const firstCharacters = await firstResponse.json();
    const total_characters = firstCharacters.info.count;
    const primeNumbers = arrayPrimeNumber(total_characters);
    // Second call of characters ---> this call is to capture the characters where the id is a prime number
    const response = await fetch(url+'/'+primeNumbers);
    const characters = await response.json();
    
    const data = characters.map((character)=>{
        const fullName = character.name.split(" ");
        let firstName = "";
        let lastname = "";
        if (fullName.length == 1){firstName = fullName[0];}
        else{
            for (let i in fullName){
                if(i == (fullName.length - 1)){lastname = fullName[i];}
                else{firstName = firstName + fullName[i] + " ";}
            }
        } 
        return {
            "character_id": character.id,
            "firstname": firstName.trim(),
            "lastname": lastname,
            "status_character": character.status,
            "character_species": character.species,
            "character_gender": character.gender,
            "origin": character.origin.name
        } 
    });
    // console.log(data);
    return data;
}

let contacts; 
functionContacts(url_character).then(data => contacts = data);


router.get('/', async (req,res)=>{   
    res.send(contacts);
    createContact(contacts);
}); 



router.post('/',(req,res)=>{
    console.log("POST Character");
    const properties_req =req.body.properties;
    const { character_id, firstname, lastname, status_character, character_species, character_gender } = properties_req;
    let aux = 'new';
    // console.log(");
    if (character_id.value && firstname.value && lastname.value && status_character.value && character_species.value && character_gender.value){
        contacts.map((contact)=>{
            if (contact.character_id == character_id.value){
                aux = 'update';
                contact.firstname = firstname.value;
                contact.lastname = lastname.value;
                contact.status_character = status_character.value;
                contact.character_species = character_species.value;
                contact.character_gender = character_gender.value;
                console.log("\n\ncontact:\n",contact);
            }           
        });
        if (aux=='new'){
            const id = contacts[contacts.length-1].character_id + 1;
            const newContact = {
                "character_id": id,
                "firstname": firstname.value,
                "lastname": lastname.value,
                "status_character": status_character.value,
                "character_species": character_species.value,
                "character_gender": character_gender.value,
            };
            contacts.push(newContact);
            res.send('create a new contact');
        }else{
            res.send('update contacts');
        }
    }else{
        res.status(500).json({error: 'There was an error.'});
    }
    console.log("\nEND POST CHARACTERS\n");
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