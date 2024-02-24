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
    // const allLocations = locationService.getAllLocations();
    const locationPropierties = req.body.properties;
    const createUpdateCompany = locationService.postCreateUpdateCompany(locationPropierties);
    res.status(201).send({ status:"ok", action:"post",data: createUpdateCompany})

    
    console.log("\nEND POST LOCATION\n");
    // res.send("recieved");
};


module.exports = {
    getAllLocations,
    getCreateCompany,
    postCreateUpdateCompany
}