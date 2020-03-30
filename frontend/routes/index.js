const express = require('express');
const router = express.Router();

const indexCtrl = require('../controllers/index');

/* route inscription */
router.get('/', indexCtrl.getPageRoot);


module.exports = router;