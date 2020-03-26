const models = require('../models');
const jwtUtils = require('../utils/jwt');

exports.addComment = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }

    var title = req.body.title;
    var content = req.body.content;
    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    if (title.length <= 2 || content.length <= 4) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    
    var id = parseInt(req.params.id);
    if (!isNaN(id)) {
        models.Message.findOne({ where: { id: id, UserId: userId } })
        .then(message => {
            if (message) {
                //
            } else {
                res.status(404).json({ 'error': 'nothing found'});
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }

};

exports.getComment = (req, res, then) => {
    //
};

exports.deleteComment = (req, res, then) => {
    //
}