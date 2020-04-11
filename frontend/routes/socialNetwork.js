const express = require('express');
const router = express.Router();

const socialCtrl = require('../controllers/socialNetwork');

// affiche le mur de message
router.get('/', socialCtrl.getPageWall);
//affiche un message
router.get('/message:id', socialCtrl.getPageMessage);
// page pour créer un nouveau message
router.get('/new', socialCtrl.createMessage);
// page pour supprimer un message
router.get('/delete:id', socialCtrl.deleteMessage );

module.exports = router;