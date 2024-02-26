const characterService = require("../services/characterService");

const getAllCharacters = (req, res) => {
  const allCharacters = characterService.getALLCharacters();
  res.send({ status: "OK", data: allCharacters });
};

const getCreateContact = async (req, res) => {
  const allCharacters = characterService.getALLCharacters();
  const { createContactSource, createContactMirror } =
    await characterService.getCreateContact(allCharacters);
  res.send({
    status: "OK",
    action: "Create",
    data_source: createContactSource,
    data_mirror: createContactMirror,
  });
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
  getCreateContact,
  postCreateUpdateContact,
};
