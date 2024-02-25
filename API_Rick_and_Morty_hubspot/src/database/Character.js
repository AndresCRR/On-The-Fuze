const DB = require("./db.json");
const {v4: uuidv4} = require("uuid");
const hubspot = require('@hubspot/api-client');
const data_key = require('./private.json');

const hubspotClient = new hubspot.Client({ accessToken: data_key.key });

const url_character = "https://rickandmortyapi.com/api/character";
let contacts;

functionContacts(url_character).then(data => contacts = data);

const getAllCharacters = () => {
    return contacts;
}

const getCreateCharacters = async (contacts) => {
    const createCharacters = await createContact(contacts);
    return createCharacters;
}

const postCreateUpdateContact = (contacPropierties) => {
    
    const { character_id, firstname, lastname, status_character, character_species, character_gender, hs_object_id } = contacPropierties;
    const contactNewUpdate = [];
    let aux = 'new';
    if (character_id.value){
        //update contact
        contacts.map((contact) => {
            if (contact.character_id == character_id.value) {
                aux = 'update';
                contact.firstname = firstname.value;
                contact.lastname = lastname.value;
                contact.status_character = status_character.value;
                contact.character_species = character_species.value;
                contact.character_gender = character_gender.value;
                console.log("\ncontact:\n", contact);
                contactNewUpdate.push(contact);
            }
        });
    }else{
        //create contact
        const id = uuidv4();
        const newContact = {
            "character_id": id,
            "firstname": firstname.value,
            "lastname": lastname.value,
            "status_character": status_character.value,
            "character_species": character_species.value,
            "character_gender": character_gender.value,
        };
        contacts.push(newContact);
        contactNewUpdate.push(newContact);
        console.log("New Contact");
        console.log(hs_object_id.value);
        const BatchInputSimplePublicObjectBatchInput = { inputs: [
            {   
                "id":hs_object_id.value,
                "properties":{
                    "character_id":id
                }
            }] };
        console.log(BatchInputSimplePublicObjectBatchInput);
        // try {
        //   const apiResponse = await hubspotClient.crm.contacts.batchApi.update(BatchInputSimplePublicObjectBatchInput);
        //   console.log(JSON.stringify(apiResponse, null, 2));
        // } catch (e) {
        //   e.message === 'HTTP request failed'
        //     ? console.error(JSON.stringify(e.response, null, 2))
        //     : console.error(e)
        // }
    }
    // if (character_id.value && (firstname.value || lastname.value) && status_character.value && character_species.value && character_gender.value) {
    //     contacts.map((contact) => {
    //         if (contact.character_id == character_id.value) {
    //             aux = 'update';
    //             contact.firstname = firstname.value;
    //             contact.lastname = lastname.value;
    //             contact.status_character = status_character.value;
    //             contact.character_species = character_species.value;
    //             contact.character_gender = character_gender.value;
    //             console.log("\ncontact:\n", contact);
    //             contactNewUpdate.push(contact);
    //         }
    //     });
    //     if (aux == 'new') {
    //         const newContact = {
    //             "character_id": character_id.value,
    //             "firstname": firstname.value,
    //             "lastname": lastname.value,
    //             "status_character": status_character.value,
    //             "character_species": character_species.value,
    //             "character_gender": character_gender.value,
    //         };
    //         contacts.push(newContact);
    //         contactNewUpdate.push(newContact);
    //         // res.send('create a new contact');
    //     } else {
    //         // res.send('update contacts');
    //     }
    // }
    // else{
    //     res.status(500).json({error: 'There was an error.'});
    // }
    return contactNewUpdate;
};

function arrayPrimeNumber(number) {
    const array_number = [1];
    for (let n = 1; n <= number; n++) {
        let count = 0;
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) count++;
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
    const response = await fetch(url + '/' + primeNumbers);
    const characters = await response.json();

    const data = characters.map((character) => {
        const fullName = character.name.split(" ");
        let firstName = "";
        let lastname = " ";
        if (fullName.length == 1) { firstName = fullName[0]; }
        else {
            for (let i in fullName) {
                if (i == (fullName.length - 1)) { lastname = fullName[i]; }
                else { firstName = firstName + fullName[i] + " "; }
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
    return data;
}

async function createContact(characters) {
    if(!characters)return;
    const allContacts = await hubspotClient.crm.contacts.getAll(undefined, undefined, ["lastname", "firstname", "character_id"]);
    const contactsCharacterIds = [];
    const contactCreates = [];
    let aux = 0;
    allContacts.map((data_contac) => {
        contactsCharacterIds.push(data_contac.properties.character_id);
    })
    const data = characters.map(async (character) => {
        for (let i in contactsCharacterIds) {
            if (contactsCharacterIds[i] == character.character_id) {
                aux = 1;
            }
        }
        if (aux == 1) { aux = 0; }
        else {
            const contact = {
                properties: {
                    "character_id": character.character_id,
                    "firstname": character.firstname,
                    "lastname": character.lastname,
                    "status_character": character.status_character,
                    "character_species": character.character_species,
                    "character_gender": character.character_gender,
                    "country": character.origin
                },
            }
            contactCreates.push(contact);
            console.log(contact);
            const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contact);
        }
    });
    return contactCreates;
}

module.exports = {
    getAllCharacters,
    getCreateCharacters,
    postCreateUpdateContact
};