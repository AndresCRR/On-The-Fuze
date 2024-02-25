const { Router } = require("express");
const locationController = require("../../controllers/locationController");
const router = Router();

router
  .get("/", locationController.getAllLocations)
  .get("/create", locationController.getCreateCompany)
  .post("/", locationController.postCreateUpdateCompany);

module.exports = router;
