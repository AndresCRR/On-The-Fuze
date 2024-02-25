const { Router } = require("express");
const _ = require("underscore");
const characterController = require("../../controllers/characterController");
const router = Router();

router
  .get("/", characterController.getAllCharacters)
  .get("/create", characterController.getCreateContact)
  .post("/", characterController.postCreateUpdateContact);

// router.put('/:id', (req, res) => {
//     const { id } = req.params;
//     const { firstname, lastname, status_character, character_species, character_gender } = req.body;
//     if (firstname && lastname && status_character && character_species && character_gender) {
//         _.each(contacts, (contact, i) => {
//             if (contact.id == id) {
//                 contact.firstname = firstname;
//                 contact.lastname = lastname;
//                 contact.status_character = status_character;
//                 contact.character_species = character_species;
//                 contact.character_gender = character_gender;
//                 // console.log(firstname)
//             }
//         });
//         res.json(contacts);
//     } else {
//         res.status(500).json({ error: 'There was an error.' })
//     }
// });

// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     _.each(contacts, (contact, i) => {
//         if (contact.id == id) {
//             contacts.splice(i, 1);
//         }
//     })
//     res.send(contacts);
// });

module.exports = router;
