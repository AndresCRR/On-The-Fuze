import express from 'express'
import morgan from 'morgan'
import characters from './routes/characters.js'
import locations from './routes/locations.js'
import associate from './routes/associate.js';

const app = express();

//settings
app.set('port', process.env.PORT || 3000)

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use('/api/associate', associate);
app.use('/api/characters', characters);
app.use('/api/locations', locations);

//starting the server 
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
}) 