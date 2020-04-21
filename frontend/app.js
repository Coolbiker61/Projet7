const express = require('express');
const bodyParser = require('body-parser');


const path = require('path');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const snRoutes = require('./routes/socialNetwork');
const adminRoutes = require('./routes/admin');

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
app.use('/styles', express.static(path.join(__dirname, 'styles')));
// pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));
// pour le javascript spécifique aux pages
app.use('/js', express.static(path.join(__dirname, 'js')));

/* définition du chemin vers les fichiers contenant les routes */
app.use('/auth', userRoutes);
// route de l'index
app.use('/', indexRoutes);
// route du reseau social
app.use('/socialNetwork', snRoutes);
// route d'administration
app.use('/admin', adminRoutes);

module.exports = app;