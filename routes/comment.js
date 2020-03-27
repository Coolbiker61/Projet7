const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');

//get all comment
router.get('/:idMessage', commentCtrl.getComment);
//get One comment
router.get('/:idMessage/:idComment', commentCtrl.getOneComment);

// add a comment
router.post('/:idMessage', commentCtrl.addComment);
// delete a comment
router.delete('/:idComment', commentCtrl.deleteComment);


module.exports = router;