const express = require('express');
const router = express.Router();

const messagectrl = require('../controllers/message');
const likectrl = require('../controllers/like');

//create message
router.post('/', messagectrl.createMessage);
// get all message
router.get('/', messagectrl.getAllMessages);
// get all message of a user
router.get('/user/:idUser', messagectrl.getAllMessagesUser);
// get all message
router.get('/:id', messagectrl.getOneMessages);
//delete message
router.delete('/:id', messagectrl.deleteMessage);
//update message
router.put('/:id', messagectrl.updateMessage);

// like message
router.post('/:id/like/:likeType', likectrl.likeMessage);
router.get('/:id/like/', likectrl.getLike);

module.exports = router;