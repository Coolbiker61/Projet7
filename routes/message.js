const express = require('express');
const router = express.Router();

const messagectrl = require('../controllers/message');

//create message
router.post('/', messagectrl.createMessage);
// get all message
router.get('/', messagectrl.getAllMessages);
// get all message
router.get('/:id', messagectrl.getOneMessages);
//delete message
router.delete('/:id', messagectrl.deleteMessage);
//update message
router.put('/:id', messagectrl.updateMessage);

module.exports = router;