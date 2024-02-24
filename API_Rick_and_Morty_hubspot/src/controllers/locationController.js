const locationService = require("../services/locationService")


const getAllLocations = (req, res) => {
    const allLocations = locationService.getAllLocations();
    res.send({ status: "OK", data: allLocations });
};

const getCreateCompany = async (req, res) => {
    const allLocations = locationService.getAllLocations();
    const createLocations = locationService.getCreateCompany(allLocations);
    res.send({ status: "OK", action: "Create", data: createLocations });
};

const postCreateUpdateCompany = (req, res) => {
    console.log("POST location");
    const headers = req.headers;
    const location = req.body;
    const location_propierties = req.body.properties;
    console.log("\nHeders");
    console.log(headers);
    console.log("\nbody");
    console.log(location);
    console.log("\nbody propiertis");
    console.log(location_propierties);
    // const { location_id, name, location_type, dimension, creation_date } = location_propierties;
    // let aux = 'new';
    // if (location_id.value && name.value && location_type.value && dimension.value && creation_date.value) {
    //     locations.map((location) => {
    //         if (location.location_id == location_id.value) {
    //             aux = 'update';
    //             location.name = name.value;
    //             location.location_type = location_type.value;
    //             location.dimension = dimension.value;
    //             location.creation_date = creation_date.value;
    //             console.log("\nlocation: \n", location);
    //         }
    //     });
    //     if (aux == 'new') {
    //         const newLocation = {
    //             "character_id": location_id.value,
    //             "name": name.value,
    //             "location_type": location_type.value,
    //             "dimension": dimension.value,
    //             "creation_date": creation_date.value
    //         };
    //         locations.push(newLocation);
    //         res.send('create a new location');
    //     } else {
    //         res.send('update location');
    //     }
    // }
    console.log("\nEND POST LOCATION\n");
    res.send("recieved");
};


module.exports = {
    getAllLocations,
    getCreateCompany,
    postCreateUpdateCompany
}