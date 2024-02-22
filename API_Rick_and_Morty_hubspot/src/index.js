const express = require('express');
const app = express();
const morgan = require('morgan');

//settings
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//routes
app.use('/api/associate',require('./routes/associate'));
app.use('/api/characters',require('./routes/characters'));
app.use('/api/locations',require('./routes/locations'));

//starting the server 
app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
}) 