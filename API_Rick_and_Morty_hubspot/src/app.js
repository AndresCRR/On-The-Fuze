const express = require('express');
const morgan = require('morgan');
const v1Characters = require('./v1/routes/characterRoutes.js');
const v1Locations = require('./v1/routes/locationRoutes.js');
const v1Associates = require('./v1/routes/associateRoutes.js');

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use('/api/v1/associates', v1Associates);
app.use('/api/v1/characters', v1Characters);
app.use('/api/v1/locations', v1Locations);
app.use('/task',(req,res)=>{
    res.send([]);
});

module.exports ={
    app
}