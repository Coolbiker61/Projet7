const models = require('../models');
const jwtUtils = require('../utils/jwt');
const fs = require('fs');

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
    models.User.findOne({attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
        .then(userFound => {
            if(!userFound) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                models.Message.create({ title: title, UserId: userId, content: content, likes: 0},
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
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    models.User.findOne({attributes: [ 'id', 'username', 'isAdmin'], where: { id: userId } })
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
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    models.User.findOne({attributes: [ 'id', 'username', 'isAdmin'], where: { id: userId } })
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
                    UserId: idOfUser
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
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    
    var id = parseInt(req.params.id);
    models.User.findOne({attributes: [ 'id', 'username', 'isAdmin'], where: { id: userId } })
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'User not found !'});
        } else {
            if (id != null && !isNaN(id) && id > 0) {
                models.Message.findOne({ where: { id: id} })
                .then(message => {
                    if (message) {
                        if (user.isAdmin || user.id == message.userId) {
                            if (message.content.indexOf('<img src="') != -1) {
                                var imagesUrlOrigin = Array.from(message.content.matchAll(/(<img src=\")+.+(\" alt)/));
                                for(const img of imagesUrlOrigin) {
                                    var urlCut = img[0].split('<img src="')[1].split('" alt')[0].split('/');
                                    if (urlCut[2] == req.get('host')) {
                                        if (urlCut[(urlCut.length-1)].include('?')) {
                                            urlCut[(urlCut.length-1)] = urlCut[(urlCut.length-1)].split('?')[0];
                                        }
                                        fs.unlink(`userImg/${urlCut[(urlCut.length-1)]}`, (err) => {
                                            if (err) {
                                                //message d'erreur si la suppression n'a pu être faite
                                                console.log("failed to delete local image:"+err);
                                            }
                                        });
                                    }
                                }
                            }
                            models.Message.destroy({ where: { id: id } })
                            .then(message => {
                                if (message) {
                                    res.status(200).json({ message: 'message deleted !'});
                                } else {
                                    res.status(404).json({ 'error': 'nothing found !'});
                                }
                            })
                            .catch(error => {
                                res.status(500).json({ error });
                            })
                        } else {
                            return res.status(401).json({ 'error': 'Insufficient rights  !'});
                        }
                        
                    } else {
                        res.status(404).json({ 'error': 'nothing found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
            } else {
                return res.status(400).json({ 'error': 'id not valid !'})
            }
        }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.updateMessage = (req, res, then) => {
    //
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
    
    var id = parseInt(req.params.id);
    models.User.findOne({where: { id: userId }, attributes: [ 'id', 'username', 'isAdmin']})
    .then(user => {
        if(!user) {
            return res.status(401).json({ error: 'User not found !'});
        } else {
            if (id != null && !isNaN(id) && id > 0) {
                models.Message.findOne({ where: { id: id} })
                .then(message => {
                    if (message) {
                        if (user.isAdmin || user.id == message.userId) {
                            if (message.content.indexOf('<img src="') != -1) {
                                var imagesUrlUpdate = Array.from(content.matchAll(/(<img src=\")+\w+(\" alt)/));
                                var imagesUrlOrigin = Array.from(message.content.matchAll(/(<img src=\")+\w+(\" alt)/));
                                let listImagesNameOrigin = [];
                                let listImagesNameUpdate = [];
                                
                                for(const img of imagesUrlOrigin) {
                                    var urlCut = img[0].split('<img src="')[1].split('" alt')[0].split('/');
                                    if (urlCut[2] == req.get('host')) {
                                        if (urlCut[(urlCut.length-1)].includes('?')) {
                                            urlCut[(urlCut.length-1)] = urlCut[(urlCut.length-1)].split('?')[0];
                                        }
                                        listImagesNameOrigin.push(urlCut[(urlCut.length-1)]);
                                    }
                                }
                                console.log(imagesUrlUpdate);
                                if ( imagesUrlUpdate.length > 0 ) {
                                    for(const img of imagesUrlUpdate) {                                        
                                        var urlCut = img[0].split('<img src="')[1].split('" alt')[0].split('/');
                                        if (urlCut[2] == req.get('host')) {
                                            if (urlCut[(urlCut.length-1)].includes('?')) {
                                                urlCut[(urlCut.length-1)] = urlCut[(urlCut.length-1)].split('?')[0];
                                            }
                                            listImagesNameUpdate.push(urlCut[(urlCut.length-1)]);
                                        }
                                    }
                                }
                                for (const image of listImagesNameOrigin) {
                                    console.log(listImagesNameUpdate.length +' - '+listImagesNameUpdate.includes(image));
                                    if ( listImagesNameUpdate.length == 0 ) {
                                        fs.unlink(`userImg/${image}`, (err) => {
                                            if (err) {
                                                //message d'erreur si la suppression n'a pu être faite
                                                console.log("failed to delete local image:"+err);
                                            }
                                        });
                                    } else if ( !listImagesNameUpdate.includes(image) ) {
                                        fs.unlink(`userImg/${image}`, (err) => {
                                            if (err) {
                                                //message d'erreur si la suppression n'a pu être faite
                                                console.log("failed to delete local image:"+err);
                                            }
                                        });
                                    }
                                }
                            }
                            
                            models.Message.update({ 
                                title: (title != message.title) ? title : message.title,
                                content: (content != message.content) ? content : message.content
                            }, { where: {id: id}})
                            .then(result => {
                                res.status(201).json(result);
                            })
                            .catch(error => { res.status(500).json({ error }); })
                        } else {
                            return res.status(401).json({ 'error': 'Insufficient rights  !'});
                        }
                        
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
    })
    .catch(error => res.status(500).json({ error }));

}