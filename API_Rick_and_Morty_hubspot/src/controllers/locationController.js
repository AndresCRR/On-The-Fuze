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
    const locationPropierties = req.body.properties;
    const createUpdateCompany = locationService.postCreateUpdateCompany(locationPropierties);
    res.status(201).send({ status:"ok", action:"post",data: createUpdateCompany})
};


module.exports = {
    getAllLocations,
    getCreateCompany,
    postCreateUpdateCompany
}