const express = require('express');
const bodyParser = require('body-parser');


const path = require('path');
const userRoutes = require('./routes/user');

const app = express();

/* définition du CROS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// pour le css
app.use(express.static('styles'));
//our les images
app.use(express.static('images'));

/* définition du chemin vers les fichiers contenant les routes */
app.use('/auth', userRoutes);


module.exports = app;