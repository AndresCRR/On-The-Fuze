const { Router } = require("express");
const characterController = require("../../controllers/characterController");
const router = Router();

router
  .get("/", characterController.getAllCharacters)
  .get("/create", characterController.getCreateContact)
  .post("/", characterController.postCreateUpdateContact);

module.exports = router;
