const Character = require("../database/Character");

const getALLCharacters = () => {
  const allCharacters = Character.getAllCharacters();
  return allCharacters;
};
const getCreateContact = async (characters) => {
  const createContact = await Character.getCreateCharacters(characters);
  return createContact;
};
const postCreateUpdateContact = async (contacPropierties) => {
  const createUpdateContact = await Character.postCreateUpdateContact(
    contacPropierties
  );
  return createUpdateContact;
};

module.exports = {
  getALLCharacters,
  getCreateContact,
  postCreateUpdateContact,
};
