const Character = require("../database/Character");

const getALLCharacters = () => {
    const allCharacters = Character.getAllCharacters();
    return allCharacters;
};
const getCreateContact = async (characters) => {
    const createContact = await Character.getCreateCharacters(characters);
    return createContact;
};
const postCreateUpdateContact = () => {
    return;
};

module.exports = {
    getALLCharacters,
    getCreateContact,
    postCreateUpdateContact
}