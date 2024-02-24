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
    const contacPropierties = req.body.properties;
    const createUpdateContact = characterService.postCreateUpdateContact(contacPropierties);
    res.status(201).send({ status:"ok", action:"post",data: createUpdateContact})
    // const properties_req = req.body.properties;
    console.log("\nEND POST CHARACTERS\n");
}


module.exports = {
    getAllCharacters,
    getCreateContact,
    postCreateUpdateContact
}; 