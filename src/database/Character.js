const DB = require("./db.json");
const { v4: uuidv4 } = require("uuid");
const hubspot = require("@hubspot/api-client");
const data_key = require("./private.json");

const hubspotClientSource = new hubspot.Client({
  accessToken: data_key.source.token,
});
const hubspotClientMirror = new hubspot.Client({
  accessToken: data_key.mirror.token,
});

const url_character = "https://rickandmortyapi.com/api/character";
let contacts;

functionCharacters(url_character).then((data) => {
  contacts = data;
});

const getAllCharacters = async () => {
  await createContact(contacts);
  return contacts;
};

const postCreateUpdateContact = async (contacPropierties) => {
  const createUpdateContact = await createUpdateCharacters(
    contacPropierties,
    contacts
  );
  return createUpdateContact;
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
  return array_number;
}

//Function for call all characters from API Rick and Morty
async function functionCharacters(url) {
  // First call of characters ---> this call is to know the total characters
  const firstResponse = await fetch(url);
  const firstCharacters = await firstResponse.json();
  const total_characters = firstCharacters.info.count;
  const primeNumbers = arrayPrimeNumber(total_characters);
  // Second call of characters ---> this call is to capture the characters where the id is a prime number
  const response = await fetch(url + "/" + primeNumbers);
  const characters = await response.json();

  const data = characters.map((character) => {
    const fullName = character.name.split(" ");
    let firstName = "";
    let lastname = " ";
    if (fullName.length == 1) {
      firstName = fullName[0];
    } else {
      for (let i in fullName) {
        if (i == fullName.length - 1) {
          lastname = fullName[i];
        } else {
          firstName = firstName + fullName[i] + " ";
        }
      }
    }
    return {
      character_id: character.id,
      firstname: firstName.trim(),
      lastname: lastname,
      status_character: character.status,
      character_species: character.species,
      character_gender: character.gender,
      location: character.location.name,
    };
  });
  return data;
}

//Funnction for create contacts in hubspot from this api
async function createContact(characters) {
  if (!characters) return;
  const allContactsSource = await hubspotClientSource.crm.contacts.getAll(
    undefined,
    undefined,
    ["lastname", "firstname", "character_id"]
  );
  const allContactsMirror = await hubspotClientMirror.crm.contacts.getAll(
    undefined,
    undefined,
    ["lastname", "firstname", "character_id"]
  );
  const createContactSource = [];
  const createContactMirror = [];
  characters.map(async (character) => {
    const contactHsSource = allContactsSource.find(
      (data_contact) =>
        data_contact.properties.character_id == character.character_id
    );
    const contactHsMirror = allContactsMirror.find(
      (data_contact) =>
        data_contact.properties.character_id == character.character_id
    );
    const contact = {
      properties: {
        character_id: character.character_id,
        firstname: character.firstname,
        lastname: character.lastname,
        status_character: character.status_character,
        character_species: character.character_species,
        character_gender: character.character_gender,
      },
    };
    if (!contactHsSource) {
      createContactSource.push(contact);
      const createContactResponseSource =
        await hubspotClientSource.crm.contacts.basicApi.create(contact);
    }
    // if (!contactHsMirror) {
    //   createContactMirror.push(contact);
    //   const createContactResponseMirror =
    //     await hubspotClientMirror.crm.contacts.basicApi.create(contact);
    // }
  });
  return { createContactSource, createContactMirror };
}

async function createUpdateCharacters(contacPropierties, contacts) {
  if (!contacts) return [];
  const {
    character_id,
    firstname,
    lastname,
    status_character,
    character_species,
    character_gender,
    hs_object_id,
  } = contacPropierties;
  const responseMirror = await hubspotClientMirror.crm.contacts.getAll(
    undefined,
    undefined,
    ["lastname", "firstname", "character_id"]
  );
  const contactMirror = responseMirror.find(
    (response) => response.properties.character_id == character_id.value
  );
  console.log("\ncontactMirror\n");
  console.log(contactMirror);
  console.log("\nCharacter_id\n");
  console.log(character_id);
  if (character_id) {
    if (!contactMirror) {
      const contact = {
        properties: {
          character_id: character_id.value,
          firstname: firstname.value,
          lastname: lastname.value || "",
          status_character: status_character.value || "",
          character_species: character_species.value || "",
          character_gender: character_gender.value || "",
        },
      };
      const creatNewContactMirror =
        await hubspotClientMirror.crm.contacts.basicApi.create(contact);
      return;
    }
    //update contact
    const contactToUpdate = contacts.find(
      (contact) => contact.character_id == character_id.value
    );
    contactToUpdate.firstname = firstname.value;
    contactToUpdate.lastname = lastname.value;
    contactToUpdate.status_character = status_character.value;
    contactToUpdate.character_species = character_species.value;
    contactToUpdate.character_gender = character_gender.value;
    const BatchInputSimplePublicObjectBatchInput = {
      inputs: [
        {
          id: contactMirror.id,
          properties: {
            firstname: firstname.value,
            lastname: lastname.value,
            status_character: status_character.value,
            character_species: character_species.value,
            character_gender: character_gender.value,
          },
        },
      ],
    };
    try {
      const apiResponseMirror =
        await hubspotClientMirror.crm.contacts.batchApi.update(
          BatchInputSimplePublicObjectBatchInput
        );
      return contactToUpdate;
    } catch (e) {
      e.message === "HTTP request failed"
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e);
    }
    return contactToUpdate;
  } else {
    //create contact in characters an update character_id in contacts
    const id = uuidv4();
    const newContact = await createNewCharacter(
      firstname.value,
      lastname.value,
      status_character.value,
      character_species.value,
      character_gender.value,
      hs_object_id.value,
      id
    );
    contacts.push(newContact);
    const contact = {
      properties: {
        character_id: id,
        firstname: firstname.value,
        lastname: lastname.value || "",
        status_character: status_character.value || "",
        character_species: character_species.value || "",
        character_gender: character_gender.value || "",
      },
    };
    const creatNewContactMirror =
      await hubspotClientMirror.crm.contacts.basicApi.create(contact);
    return newContact;
  }
}

async function createNewCharacter(
  firstname,
  lastname,
  status_character,
  character_species,
  character_gender,
  hs_object_id,
  id
) {
  const newContact = {
    character_id: id,
    firstname: firstname,
    lastname: lastname,
    status_character: status_character,
    character_species: character_species,
    character_gender: character_gender,
  };
  const BatchInputSimplePublicObjectBatchInputSource = {
    inputs: [
      {
        id: hs_object_id,
        properties: {
          character_id: id,
        },
      },
    ],
  };
  try {
    const apiResponseSource =
      await hubspotClientSource.crm.contacts.batchApi.update(
        BatchInputSimplePublicObjectBatchInputSource
      );
    return newContact;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}

function exportContacts() {
  return contacts;
}

module.exports = {
  getAllCharacters,
  postCreateUpdateContact,
  arrayPrimeNumber,
  url_character,
  exportContacts,
};
