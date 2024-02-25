![](https://1000marcas.net/wp-content/uploads/2023/01/HubSpot-Logo.png)
# BACKEND DEVELOPER TEST

In this repository we will find the solution to the challenge for the position of backend developer in the company on the fuze, then a brief summary of development

- Create the function to get the characters and locations from the rick and morty API.
- Migrate characters and locations from the Rick and Morty API to Husbpot as contacts and companies.
- Create association between contacts and companies.
- Integrate Hubspot whit this API to be able to create or update contacts and companies.

#RUN API

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

##GET DATA RICK AND MORTY API
For get data of characters and locations from Rick and Morty API i created the next route in the server or api:
- /api/v1/characters
- /api/v1/locations
###GET CHARACTERS
I used the following code to obtain the characters. 
```javascript
const getAllCharacters = () => {
  return contacts;
};
```
where contacts is the variable i use to store the characters of Rick and Morty API and it is preloaded whit the server is run like this
```javascript
const url_character = "https://rickandmortyapi.com/api/character";
let contacts;
functionCharacters(url_character).then((data) => (contacts = data));
```
functionCharacters is the function create for get only the characters when the id is a prime number or 1
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
###GET LOCATIONS
#MIGRATE DATA RICK AND MORTY API TO HUBSPOT
##MIGRATE CHARACTERS TO CONTACTS
##MIGRATE LOCATIONS TO COMPANIES
#ASSOCIATE CONTACTS TO COMPANIES
#INTEGRATION HUBSPOT WHIT API
