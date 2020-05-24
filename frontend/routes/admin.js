const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin')

router.get('/users', adminCtrl.getUserListe);
router.get('/users/delete/:id', adminCtrl.adminDeleteAccountConfirm);


module.exports = router;