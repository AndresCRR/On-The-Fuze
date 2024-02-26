const Character = require("../database/Character");

const getALLCharacters = async () => {
  const allCharacters = await Character.getAllCharacters();
  return allCharacters;
};
const postCreateUpdateContact = async (contacPropierties) => {
  const createUpdateContact = await Character.postCreateUpdateContact(
    contacPropierties
  );
  return createUpdateContact;
};

module.exports = {
  getALLCharacters,
  postCreateUpdateContact,
};
