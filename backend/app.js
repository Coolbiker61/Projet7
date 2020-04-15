const express = require('express');
const bodyParser = require('body-parser');


const path = require('path');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/message');
const commentRoutes = require('./routes/comment');

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


app.get('/', function (req, res) {
  res.status(200).json({ message: "hello" });
});

/* autorise l'accès aux fichier du dossier images */
app.use('/userImg', express.static(path.join(__dirname, 'userImg')));


/* définition du chemin vers les fichiers contenant les routes */
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/comment', commentRoutes);


module.exports = app;