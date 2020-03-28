const models = require('../models');
const jwtUtils = require('../utils/jwt');

exports.createMessage = (req, res, then) => {
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
    models.User.findOne({ where: { id: userId } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                models.Message.create({ title: title, content: content, likes: 0, UserId: user.id })
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

    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;

    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['id', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['username']
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

exports.getOneMessages = (req, res, then ) => {
    //retourne le message dont l'id a été passé
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }

    
    var id = parseInt(req.params.id);
    if (id != null) {
        models.Message.findOne({ where: { id: id } })
        .then(message => {
            if (message) {
                res.status(200).json(message);
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