const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/* route inscription */
router.post('/signup', userCtrl.signup);
/* route connexion */
router.post('/login', userCtrl.login);
/* route pour afficher le profil */
router.get('/profil', userCtrl.getUserProfile);
/* route pour supprimer un compte */
router.delete('/', userCtrl.deleteUser);

module.exports = router;