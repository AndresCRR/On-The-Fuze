const DB = require("./db.json");
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
    getCreateCharacters
};