const models = require('../models');
const jwtUtils = require('../utils/jwt');
const asyncLib = require('async');

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

    if (content == null || content.length <= 7) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    if (!isNaN(idMessage)) {
        models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Message.findOne({ where: { id: idMessage} })
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
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;


    if (!isNaN(idMessage)) {
        models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Message.findOne({ where: { id: idMessage} })
                .then(message => {
                    if (message) {
                        models.Comment.findAll({ 
                            where: { messageId: idMessage },
                            order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
                            limit: (!isNaN(limit)) ? limit : null,
                            offset: (!isNaN(offset)) ? offset : null,
                            include: [{
                                model: models.User,
                                as: 'user',
                                attributes: ['id', 'username']
                            }],
                        })
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
        models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Message.findOne({ where: { id: idMessage } })
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
        models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                console.log(idComment);
                models.Comment.findOne({ where: { id: idComment }, attributes: ['id', 'parent', 'userId']})
                .then(comment => {
                    if (comment) {
                        console.log(comment.id);
                        if (comment.userId == user.id || user.isAdmin) {
                            var comments = [comment];
                            console.log(comments);
                            (async function() {
                                for await (var commentActif of comments) {
                                    models.Comment.findAll({ where: { parent: commentActif.id }, attributes: ['id', 'parent']})
                                    .then(response => {
                                        if (response.length > 0) {
                                            comments = comments.concat(response);
                                            console.log(comments);
                                        }
                                        console.log(response);
                                        models.Comment.destroy({where: { id: response.id }})
                                        .then(() => {
                                            console.log('com destroyed');
                                        })
                                        .catch(error => { res.status(500).json({ destroy: error }); });
                                        console.log('comm +-+-+--+-+-+-+-+-+--+-+-+--+');
                                    })
                                    .catch(error => { 
                                        console.log('erreur get comment '+error); 
                                        return res.status(500).json({ getcomm: error });  
                                    });
                                }
                                console.log('------++++--------------------');
                                return res.status(200).json({ message: 'Comment deleted'});
                            })();
                            console.log( '--------------------------');
                            
                        } else {
                            return res.status(401).json({ 'error': 'Action not allow !'})
                        }
                    } else {
                        return res.status(404).json({ 'comment': 'Not found !'})
                    }
                })
                .catch(error => { 
                    console.log(error);
                    res.status(500).json({ comment: error }); 
                });
            }
        })
        .catch(error => res.status(500).json({ user: error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
}

exports.updateComment = (req, res, then) => {
    //idComment
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    var idComment = parseInt(req.params.idComment);

    var content = req.body.content;
    if (content == null || content.length <= 7) {
        return res.status(400).json({ 'error': 'bad request'});
    }

    if (!isNaN(idComment) && idComment > 0) {
        models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Comment.findOne({ where: { id: idComment }, attributes: ['id', 'parent', 'userId']})
                .then(comment => {
                    if (comment) {
                        if (comment.userId == user.id || user.isAdmin) {
                            
                            models.Comment.update({content: content}, {where: { id: idComment }})
                            .then(() => {
                                return res.status(201).json({ message: 'Comment updated'});
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
        .catch(error => res.status(500).json({ error }));
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
}