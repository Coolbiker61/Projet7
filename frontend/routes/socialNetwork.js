const express = require('express');
const router = express.Router();

const socialCtrl = require('../controllers/socialNetwork');

// affiche le mur de message
router.get('/', socialCtrl.getPageWall);
//affiche un message
router.get('/message/:id', socialCtrl.getPageMessage);
// page pour créer un nouveau message
router.get('/new', socialCtrl.createMessage);


module.exports = router;