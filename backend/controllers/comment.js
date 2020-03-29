const models = require('../models');
const jwtUtils = require('../utils/jwt');

exports.addComment = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    var idMessage = parseInt(req.params.idMessage);
    var content = req.body.content;
    var parent = parseInt(req.body.parent);


    if (isNaN(parent)) {
        parent = 0;
    }

    if (content == null || content.length <= 4) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    if (!isNaN(idMessage)) {
        models.User.findOne({ where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                models.Message.findOne({ where: { id: idMessage, userId: userId } })
                .then(message => {
                    if (message) {
                        models.Comment.create({
                            userId: userId,
                            messageId: idMessage,
                            content: content,
                            parent: parent
                        })
                        .then(result => {
                            return res.status(201).json(result);
                        })
                        .catch(error => {
                            res.status(500).json({ error });
                        });
                    } else {
                        res.status(404).json({ 'error': 'nothing found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ 'error': error });
                });
            }
        })
        .catch(error => res.status(500).json({ 'error': error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }

};

exports.getComment = (req, res, then) => {
    // params idMessage
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    var idMessage = parseInt(req.params.idMessage);

    if (!isNaN(idMessage)) {
        models.User.findOne({ where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                models.Message.findOne({ where: { id: idMessage, userId: userId } })
                .then(message => {
                    if (message) {
                        models.Comment.findAll({ where: { messageId: idMessage }})
                        .then(result => {
                            return res.status(200).json(result);
                        })
                        .catch(error => {
                            res.status(500).json({ error });
                        });
                    } else {
                        res.status(404).json({ 'error': 'nothing found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ 'error': error });
                });
            }
        })
        .catch(error => res.status(500).json({ 'error': error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }

};

exports.getOneComment = (req, res, then) => {
    //idMessage idComment
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    var idMessage = parseInt(req.params.idMessage);
    var idComment = parseInt(req.params.idComment);
    if (isNaN(idComment)) {
        return res.status(400).json({ 'error': 'bad request'});
    }

    if (!isNaN(idMessage)) {
        models.User.findOne({ where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                models.Message.findOne({ where: { id: idMessage, userId: userId } })
                .then(message => {
                    if (message) {
                        models.Comment.findOne({ where: { messageId: idMessage, id: idComment }})
                        .then(result => {
                            return res.status(200).json(result);
                        })
                        .catch(error => {
                            res.status(500).json({ error });
                        });
                    } else {
                        res.status(404).json({ 'error': 'nothing found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ 'error': error });
                });
            }
        })
        .catch(error => res.status(500).json({ 'error': error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
};


exports.deleteComment = (req, res, then) => {
    //idComment
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    var idComment = parseInt(req.params.idComment);
    if (!isNaN(idComment)) {
        models.User.findOne({ where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                models.Comment.findOne({ where: { id: idComment }})
                .then(comment => {
                    if (comment) {
                        if (comment.userId == user.id || user.isAdmin) {
                            models.Comment.destroy({where: { id: idComment }})
                            .then(deleted => {
                                return res.status(200).json(deleted);
                            })
                            .catch(error => { res.status(500).json({ error }); });
                        } else {
                            return res.status(401).json({ 'error': 'Action not allow !'})
                        }
                    } else {
                        return res.status(404).json({ 'message': 'Not found !'})
                    }
                })
                .catch(error => { res.status(500).json({ error }); });
            }
        })
        .catch(error => res.status(500).json({ 'error': error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
}