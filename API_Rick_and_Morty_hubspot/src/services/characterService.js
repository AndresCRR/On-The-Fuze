const Character = require("../database/Character");

const getALLCharacters = () => {
    const allCharacters = Character.getAllCharacters();
    return allCharacters;
};
const getCreateContact = async (characters) => {
    const createContact = await Character.getCreateCharacters(characters);
    return createContact;
};
const postCreateUpdateContact = (contacPropierties) => {
    const createUpdateContact = Character.postCreateUpdateContact(contacPropierties);
    return createUpdateContact;
};

module.exports = {
    getALLCharacters,
    getCreateContact,
    postCreateUpdateContact
}