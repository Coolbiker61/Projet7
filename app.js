const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var mysql = require('mysql');
const path = require('path');


//const User = require('./models/User')

//const userRoutes = require('./routes/user');

/* connexion a la base de donnée */
/*var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/
// Option 1: Passing parameters separately
const sequelize = new Sequelize('groupomania', 'donneurdebase', 'ebT0MbXzNavzqP6o', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Model = Sequelize.Model;

const User = sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

// Note: using `force: true` will drop the table if it already exists
User.sync({ force: true }).then(() => {
  // Now the `users` table in the database corresponds to the model definition
  return User.create({
    email: 'John@nowhere.com',
    password: 'nobody'
  });
});
// Find all users
User.findAll().then(users => {
  console.log("All users:", JSON.stringify(users, null, 4));
});

// Create a new user
User.create({ email: "Jane@doe.com", password: "Doe" }).then(jane => {
  console.log("Jane's auto-generated ID:", jane.id);
});
// Find all users
User.findAll().then(users => {
  console.log("All users:", JSON.stringify(users, null, 4));
});

// Delete everyone named "Jane"
User.destroy({
  where: {
    email: "Jane@doe.com"
  }
}).then(() => {
  console.log("Done");
});
// Find all users
User.findAll().then(users => {
  console.log("All users:", JSON.stringify(users, null, 4));
});














const app = express();

/* définition du CROS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

/* autorise l'accès aux fichier du dossier images */
//app.use('/images', express.static(path.join(__dirname, 'images')));

/* définition du chemin vers les fichiers contenant les routes */

//app.use('/api/auth', userRoutes);



module.exports = app;