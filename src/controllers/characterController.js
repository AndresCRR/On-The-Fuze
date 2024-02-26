const characterService = require("../services/characterService");

const getAllCharacters = async (req, res) => {
  const allCharacters = await characterService.getALLCharacters();
  res.send({ status: "OK", data: allCharacters });
};

const postCreateUpdateContact = async (req, res) => {
  const contactBody = req.body;
  if (!contactBody.properties)
    return res.status(400).send("Bad Request pending for properties in file");
  const contacPropierties = req.body.properties;
  if (
    (!contacPropierties.firstname && !contacPropierties.lastname) ||
    !contacPropierties.status_character ||
    !contacPropierties.character_species ||
    !contacPropierties.character_gender
  ) {
    return res.status(400).send("Bad Request");
  }
  const createUpdateContact = await characterService.postCreateUpdateContact(
    contacPropierties
  );
  res
    .status(201)
    .json({ status: "ok", action: "post", data: createUpdateContact });
};

module.exports = {
  getAllCharacters,
  postCreateUpdateContact,
};
