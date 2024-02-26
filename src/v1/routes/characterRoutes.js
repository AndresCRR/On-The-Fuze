const { Router } = require("express");
const characterController = require("../../controllers/characterController");
const router = Router();

router
  .get("/", characterController.getAllCharacters)
  .post("/", characterController.postCreateUpdateContact);

module.exports = router;
