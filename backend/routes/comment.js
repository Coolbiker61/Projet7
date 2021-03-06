const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');

//get all comment
router.get('/:idMessage', commentCtrl.getComment);
//get One comment
router.get('/one/:idComment', commentCtrl.getOneComment);

// add a comment
router.post('/:idMessage', commentCtrl.addComment);
// delete a comment
router.delete('/:idComment', commentCtrl.deleteComment);
// update a comment
router.put('/:idComment', commentCtrl.updateComment);

module.exports = router;