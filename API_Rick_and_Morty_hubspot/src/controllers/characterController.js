const characterService = require('../services/characterService')

const getAllCharacters = (req, res) => {
    const allCharacters = characterService.getALLCharacters();
    res.send({ status: "OK", data: allCharacters });
};

const getCreateContact = async (req, res) => {
    const allCharacters = characterService.getALLCharacters();
    const createContact = await characterService.getCreateContact(allCharacters);
    res.send({ status: "OK", action: "Create", data: createContact });
};

const postCreateUpdateContact = (req, res) => {
    console.log("POST Character");
    // const properties_req = req.body.properties;
    // const { character_id, firstname, lastname, status_character, character_species, character_gender } = properties_req;
    // let aux = 'new';
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
    //         res.send('create a new contact');
    //     } else {
    //         res.send('update contacts');
    //     }
    // }
    // else{
    //     res.status(500).json({error: 'There was an error.'});
    // }
    console.log("\nEND POST CHARACTERS\n");
}


module.exports = {
    getAllCharacters,
    getCreateContact,
    postCreateUpdateContact
}; 