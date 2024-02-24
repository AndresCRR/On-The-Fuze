const locationService = require("../services/locationService")


const getAllLocations = (req, res) => {
    const allLocations = locationService.getAllLocations();
    res.send({ status: "OK", data: allLocations });
};

const getCreateCompany = async (req, res) => {
    const allLocations = locationService.getAllLocations();
    // if(!allLocations)return res.status(400).send("Please charge first locations in /api/v1/locations")
    const createLocations = locationService.getCreateCompany(allLocations);
    res.send({ status: "OK", action: "Create", data: createLocations });
};

const postCreateUpdateCompany = (req, res) => {
    const locationBody = req.body;
    if(!locationBody.properties) return res.status(400).send("Bad Request pending for properties in file");
    const locationPropierties = req.body.properties;
    if(!locationPropierties.name || !locationPropierties.location_type || !locationPropierties.dimension|| !locationPropierties.creation_date ){
        return res.status(400).send("Bad Request");
    }
    const createUpdateCompany = locationService.postCreateUpdateCompany(locationPropierties);
    res.status(201).send({ status:"ok", action:"post",data: createUpdateCompany})
};


module.exports = {
    getAllLocations,
    getCreateCompany,
    postCreateUpdateCompany
}