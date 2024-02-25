![](https://1000marcas.net/wp-content/uploads/2023/01/HubSpot-Logo.png)
# BACKEND DEVELOPER TEST
In this repository we will find the solution to the challenge for the position of backend developer in the company on the fuze, then a brief summary of development

- Create the function to get the characters and locations from the rick and morty API.
- Migrate characters and locations from the Rick and Morty API to Husbpot as contacts and companies.
- Create association between contacts and companies.
- Integrate Hubspot whit this API to be able to create or update contacts and companies.
## RUN API
The first step to run the api you need to create a private app in hubspot, for this challenge i created the following application https://app.hubspot.com/private-apps/44229955/2921706 , after that copy the token and paste it in  database/private.json file

    {
        "name": "key",
        "key": "TOKEN_PRIVATE_API"
    }

the next step is to run api in a server or cloud, for this challenge use render and set it up like this
- General
	- Name: any for the server
	- Region: in this case use Oregon (US West)
- Build & Deploy
	- Repository: https://github.com/AndresCRR/On-The-Fuze
	- Branch: main
	-Root Directory:
	-Build Command: npm install
	-Start Command: npm run start

Finallly, the address of the service that was used is https://api-rick-and-morty-hubspot.onrender.com/

## GET DATA RICK AND MORTY API
For get data of characters and locations from Rick and Morty API i created the next route in the server or api:
- /api/v1/characters
- /api/v1/locations
### GET CHARACTERS
- /api/v1/characters -> https://api-rick-and-morty-hubspot.onrender.com/api/v1/characters

I used the following code to obtain the characters. 
```javascript
const getAllCharacters = () => {
  return contacts;
};
```
Where contacts is the variable i use to store the characters of Rick and Morty API and it is preloaded whit the server is run like this
```javascript
const url_character = "https://rickandmortyapi.com/api/character";
let contacts;
functionCharacters(url_character).then((data) => (contacts = data));
```
Where functionCharacters is the function created for get only the characters when the id is a prime number or 1
```javascript
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
      origin: character.origin.name,
    };
  });
  return data;
}
```
### GET LOCATIONS
- /api/v1/locations -> https://api-rick-and-morty-hubspot.onrender.com/api/v1/locations

I used the following code to obtain the locations.
```javascript
const getAllLocations = () => {
  return locations;
};
```
Where locations is the variable i use to store the locations of Rick and Morty API and it is preloaded whit the server is run like this
```javascript
const url_location = "https://rickandmortyapi.com/api/location";
let locations;
functionLocations(url_location).then((data) => (locations = data));
```
Where functionLocations is the function created for get all locations
```javascript
function arrayIdLocation(total_location) {
  const array_location = [];
  for (let i = 1; i <= total_location; i++) {
    array_location.push(i);
  }
  return array_location;
}
async function functionLocations(url) {
  const firstResponse = await fetch(url);
  const firstLocations = await firstResponse.json();
  const total_location = firstLocations.info.count;
  const endpointlocation = arrayIdLocation(total_location);
  const response = await fetch(url + "/" + endpointlocation);
  const locations = await response.json();
  const data = locations.map((location) => {
    return {
      location_id: location.id,
      name: location.name,
      location_type: location.type,
      dimension: location.dimension,
      creation_date: location.created,
    };
  });
  return data;
}
```
# MIGRATE DATA RICK AND MORTY API TO HUBSPOT
For migrate data of characters and locations from Rick and Morty API i created the next route in the server or api:
- /api/v1/characters/create
- /api/v1/locations/create
## MIGRATE CHARACTERS TO CONTACTS
- /api/v1/characters/create -> https://api-rick-and-morty-hubspot.onrender.com/api/v1/characters/create

I used the following code to migrate the characters to contacts.
```javascript
const getCreateCharacters = async (contacts) => {
  const createCharacters = await createContact(contacts);
  return createCharacters;
};
```
Where createContact is the function created for create any contact in hubspot from this API.
```javascript
async function createContact(characters) {
  if (!characters) return;
  const allContacts = await hubspotClient.crm.contacts.getAll(
    undefined,
    undefined,
    ["lastname", "firstname", "character_id"]
  );
  const contactCreates = [];
  characters.map(async (character) => {
    const contactHs = allContacts.find(
      (data_contact) =>
        data_contact.properties.character_id == character.character_id
    );
    if (!contactHs) {
      const contact = {
        properties: {
          character_id: character.character_id,
          firstname: character.firstname,
          lastname: character.lastname,
          status_character: character.status_character,
          character_species: character.character_species,
          character_gender: character.character_gender,
          country: character.origin,
        },
      };
      contactCreates.push(contact);
      console.log(contact);
      const createContactResponse =
        await hubspotClient.crm.contacts.basicApi.create(contact);
    }
  });
  return contactCreates;
}
```
## MIGRATE LOCATIONS TO COMPANIES
- /api/v1/locations/create -> https://api-rick-and-morty-hubspot.onrender.com/api/v1/locations/create

I used the following code to migrate the locations to companies.
```javascript
const getCreateCompany = async (locations) => {
  const createLocations = await createCompany(locations);
  return createLocations;
};
```
Where createCompany is the function created for create any company in hubspot from this API.
```javascript
async function createCompany(companies) {
  if (!companies) return;
  const allCompanies = await hubspotClient.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const locationCreates = [];
  companies.map(async (company) => {
    const companieHs = allCompanies.find(
      (data_companie) =>
        data_companie.properties.location_id == company.location_id
    );
    if (!companieHs) {
      const location = {
        properties: {
          location_id: company.location_id,
          name: company.name,
          location_type: company.location_type,
          dimension: company.dimension,
          creation_date: company.creation_date,
        },
      };
      locationCreates.push(location);
      console.log("\nlocation \n", location);
      const createCompanyResponse =
        await hubspotClient.crm.companies.basicApi.create(location);
    }
  });
  return locationCreates;
}
```
# ASSOCIATE CONTACTS TO COMPANIES
For associate contacts and companies in hubspot i created the next route in the server or api:
- /api/v1/associates -> https://api-rick-and-morty-hubspot.onrender.com/api/v1/associates

I used the following code to associate the contacts to companies in hubspot.

```javascript
const getAllAssociates = async () => {
  const allAssociates = await associationContactCompany();
  return allAssociates;
};
```
Where associationContactCompany is the function created for create association between contacts and companies in hubspot from this API.

```javascript
async function associationContactCompany() {
  const allContacts = await hubspotClient.crm.contacts.getAll(
    undefined,
    undefined,
    ["firstname", "lastname", "country"]
  );
  const allCompanies = await hubspotClient.crm.companies.getAll(
    undefined,
    undefined,
    ["name", "location_id"]
  );
  const allAssociates = [];

  for (contact of allContacts) {
    if (!contact) {
      continue;
    }
    const companiesAssociateContact =
      await hubspotClient.crm.associations.v4.basicApi.getPage(
        "contact",
        contact.id,
        "company"
      );
    if (companiesAssociateContact.results[0]) {
      continue;
    }
    const companyToAssociate = allCompanies.find(
      (company) => company.properties.name == contact.properties.country
    );
    if (!companyToAssociate) {
      continue;
    }
    const associate = {
      assocaites: {
        contact: {
          name:
            contact.properties.firstname + " " + contact.properties.lastname,
        },
        company: {
          name: companyToAssociate.properties.name,
        },
      },
    };
    const createAssociation =
      await hubspotClient.crm.associations.v4.basicApi.create(
        "companies",
        companyToAssociate.id,
        "contacts",
        contact.id,
        [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 2,
            // AssociationTypes contains the most popular HubSpot defined association types
          },
        ]
      );
    console.log(createAssociation);
    allAssociates.push(associate);
  }

  return allAssociates;
}
```
## INTEGRATION HUBSPOT WHIT API

Finally, i created the integration between private app of hubspot and this API,then i need to create two workflows in my private app
![]('./image/workflow_company.png')

![]('./image/workflow_contact.png')

### INTEGRATION CONTACTS
```javascript
const postCreateUpdateContact = async (contacPropierties) => {
  const createUpdateContact = await createUpdateCharacters(
    contacPropierties,
    contacts
  );
  return createUpdateContact;
};
```
```javascript
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
  if (character_id) {
    //update contact
    const contactToUpdate = contacts.find(
      (contact) => contact.character_id == character_id.value
    );
    contactToUpdate.firstname = firstname.value;
    contactToUpdate.lastname = lastname.value;
    contactToUpdate.status_character = status_character.value;
    contactToUpdate.character_species = character_species.value;
    contactToUpdate.character_gender = character_gender.value;
    return contactToUpdate;
  } else {
    //create contact in characters an update character_id in contacts
    const newContact = await createNewCharacter(
      firstname.value,
      lastname.value,
      status_character.value,
      character_species.value,
      character_gender.value,
      hs_object_id.value
    );
    contacts.push(newContact);
    return newContact;
  }
}

async function createNewCharacter(
  firstname,
  lastname,
  status_character,
  character_species,
  character_gender,
  hs_object_id
) {
  const id = uuidv4();
  const newContact = {
    character_id: id,
    firstname: firstname,
    lastname: lastname,
    status_character: status_character,
    character_species: character_species,
    character_gender: character_gender,
  };
  const BatchInputSimplePublicObjectBatchInput = {
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
    const apiResponse = await hubspotClient.crm.contacts.batchApi.update(
      BatchInputSimplePublicObjectBatchInput
    );
    return newContact;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}
```

### INTEGRATION COMPANIES 
```javascript
const postCreateUpdateCompany = async (locationPropierties) => {
  const createUpdateCompany = await createUpdateLocations(
    locationPropierties,
    locations
  );
  return createUpdateCompany;
};
```
```javascript
async function createUpdateLocations(locationPropierties, locations) {
  if (!locations) return [];
  const {
    location_id,
    name,
    location_type,
    dimension,
    creation_date,
    hs_object_id,
  } = locationPropierties;
  if (location_id) {
    const locationToUpdate = locations.find(
      (location) => location.location_id == location_id.value
    );
    locationToUpdate.name = name.value;
    locationToUpdate.location_type = location_type.value;
    locationToUpdate.dimension = dimension.value;
    locationToUpdate.creation_date = creation_date.value;
    return locationToUpdate;
  } else {
    const newLocation = await createNewLocation(
      name.value,
      location_type.value,
      dimension.value,
      creation_date.value,
      hs_object_id.value
    );
    locations.push(newLocation);
    return newLocation;
  }
}

async function createNewLocation(
  name,
  location_type,
  dimension,
  creation_date,
  hs_object_id
) {
  const id = uuidv4();
  const newLocation = {
    location_id: id,
    name: name,
    location_type: location_type,
    dimension: dimension,
    creation_date: creation_date,
  };
  const BatchInputSimplePublicObjectBatchInput = {
    inputs: [
      {
        id: hs_object_id,
        properties: {
          location_id: id,
        },
      },
    ],
  };
  try {
    const apiResponse = await hubspotClient.crm.companies.batchApi.update(
      BatchInputSimplePublicObjectBatchInput
    );
    return newContact;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
}

```