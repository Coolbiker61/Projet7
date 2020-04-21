const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin')

router.get('/users', adminCtrl.getUserListe);
// route pour consulter les messages d'un utilisateur
router.get('/users/:id', adminCtrl.getUserProfil);



module.exports = router;