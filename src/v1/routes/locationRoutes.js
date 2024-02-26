const { Router } = require("express");
const locationController = require("../../controllers/locationController");
const router = Router();

router
  .get("/", locationController.getAllLocations)
  .post("/", locationController.postCreateUpdateCompany);

module.exports = router;
