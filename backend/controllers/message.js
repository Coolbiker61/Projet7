const models = require('../models');
const jwtUtils = require('../utils/jwt');

exports.createMessage = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }

    var title = req.body.title;
    var content = req.body.content;
    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    if (title.length <= 2 || content.length <= 4) {
        return res.status(400).json({ 'error': 'bad request'});
    }
    models.User.findOne({attributes: [ 'id', 'email', 'username', 'isAdmin']},{ where: { id: userId } })
        .then(userFound => {
            if(!userFound) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Message.create({ title: title, UserId: userFound.id, content: content, likes: 0},
                    { fields: ['title', 'UserId', 'content', 'likes']})
                    .then(message => {
                        res.status(201).json(message);
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}

exports.getAllMessages = (req, res, then ) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }
    
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    models.User.findOne({attributes: [ 'id', 'username', 'isAdmin']},{ where: { id: userId } })
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'User not found !'});
        } else {
            models.Message.findAll({
                order: [(order != null) ? order.split(':') : ['id', 'DESC']],
                limit: (!isNaN(limit)) ? limit : null,
                offset: (!isNaN(offset)) ? offset : null,
                include: [{
                    model: models.User,
                    attributes: ['id', 'username']
                }]
                
            })
            .then(message => {
                if (message.length) {
                    res.status(200).json(message);
                } else {
                    res.status(404).json({ 'error': 'nothing found'});
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getAllMessagesUser = (req, res, then ) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    var idOfUser = parseInt(req.params.idUser);

    if (isNaN(idOfUser) || idOfUser < 0 ) {
        return res.status(400).json({ 'error': 'Bad parameter !'})
    }

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }
    
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    models.User.findOne({attributes: [ 'id', 'username', 'isAdmin']},{ where: { id: userId } })
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'User not found !'});
        } else {
            models.Message.findAll({
                order: [(order != null) ? order.split(':') : ['id', 'DESC']],
                limit: (!isNaN(limit)) ? limit : null,
                offset: (!isNaN(offset)) ? offset : null,
                include: [{
                    model: models.User,
                    attributes: ['id', 'username']
                }],
                where: {
                    UserId: user.id
                }
            })
            .then(message => {
                if (message.length) {
                    res.status(200).json(message);
                } else {
                    res.status(404).json({ 'error': 'nothing found'});
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneMessages = (req, res, then ) => {
    //retourne le message dont l'id a été passé en paramètre
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
 
    var id = parseInt(req.params.id);
    if (id != null && !isNaN(id)) {
        models.Message.findOne({ where: { id: id } })
        .then(message => {
            if (message) {
                message.getUser({attributes: ['id', 'username']})
                    .then( author => {
                        res.status(200).json([message,author]);
                    })
                    .catch(error => { console.log(error)})
            } else {
                res.status(404).json({ 'error': 'Nothing found'});
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
}

exports.deleteMessage = (req, res, then) => {
    //
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }
    
    var id = parseInt(req.params.id);
    if (id != null) {
        models.Message.destroy({ where: { id: id, UserId: userId } })
        .then(message => {
            if (message) {
                res.status(200).json({ message: 'message delete !'});
            } else {
                res.status(404).json({ 'error': 'nothing found !'});
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
    } else {
        return res.status(400).json({ 'error': 'id not valid !'})
    }
}

exports.updateMessage = (req, res, then) => {
    //
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
                models.Message.update({ 
                    title: (title != message.title) ? title : message.title,
                    content: (content != message.content) ? content : message.content
                 }, { where: {id: id, UserId: userId}})
                 .then(result => {
                    res.status(200).json(result);
                 })
                 .catch(error => { res.status(500).json({ error }); })
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

}