const express = require(express);
const router = express.Router();

const socialCtrl = require('../controllers/socialNetwork');


router.get('/', socialCtrl.getPageWall);




module.exports = router;