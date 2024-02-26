const Character = require("../database/Character");

const getALLCharacters = () => {
  const allCharacters = Character.getAllCharacters();
  return allCharacters;
};
const getCreateContact = async (characters) => {
  const { createContactSource, createContactMirror } =
    await Character.getCreateCharacters(characters);
  return { createContactSource, createContactMirror };
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
