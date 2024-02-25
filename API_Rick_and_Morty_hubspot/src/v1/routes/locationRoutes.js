const { Router } = require("express");
const _ = require("underscore");
const locationController = require("../../controllers/locationController");
const { route } = require("./characterRoutes");
const router = Router();

router
  .get("/", locationController.getAllLocations)
  .get("/create", locationController.getCreateCompany)
  .post("/", locationController.postCreateUpdateCompany);

// router.put('/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, location_type, dimension, creation_date } = req.body;
//     if (name && location_type && dimension && creation_date) {
//         _.each(locations, (location, i) => {
//             if (location.id == id) {
//                 location.name = name;
//                 location.location_type = location_type;
//                 location.dimension = dimension;
//                 location.creation_date = creation_date;
//             }
//         });
//         res.json(locations);
//     } else {
//         res.status(500).json({ error: 'There was an error.' })
//     }
// });

// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     _.each(locations, (location, i) => {
//         if (location.id == id) {
//             location.splice(i, 1);
//         }
//     })
//     res.send(locations);
// });

module.exports = router;
