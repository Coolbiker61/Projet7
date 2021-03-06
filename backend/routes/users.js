const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

/* route inscription */
router.post('/register', userCtrl.signup);
/* route connexion */
router.post('/login', userCtrl.login);
/* route pour afficher le profil */
router.get('/profil', userCtrl.getUserProfile);
/* route pour supprimer un compte */
router.delete('/', userCtrl.deleteUser);

// route admin liste user
router.get('/users/', userCtrl.getUserListe);
//route admin profile utilisateur
router.get('/users/:id', userCtrl.adminGetUserProfile);
//route admin delete user
router.delete('/users/:id', userCtrl.adminDeleteUserProfile);

module.exports = router;