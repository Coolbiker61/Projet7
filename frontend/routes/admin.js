const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin')

router.get('/users', adminCtrl.getUserListe);



module.exports = router;