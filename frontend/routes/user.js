const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/* route inscription */
router.get('/register', userCtrl.register);
/* route connexion */
//router.post('/login', userCtrl.login);
/* route pour afficher le profil */
//router.get('/profil', userCtrl.getUserProfile);

module.exports = router;