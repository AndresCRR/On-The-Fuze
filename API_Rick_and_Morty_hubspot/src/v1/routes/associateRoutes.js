const { Router } = require("express");
const associateController = require("../../controllers/associateController");
const router = Router();

router.get("/", associateController.getAllAssociates);

module.exports = router;
