const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/* route inscription */
router.post('/signup', userCtrl.signup);
/* route connexion */
router.post('/login', userCtrl.login);
/* route pour afficher le profil */
router.get('/profil', userCtrl.getUserProfile);

module.exports = router;