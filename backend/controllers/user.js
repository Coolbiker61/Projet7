const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt');
const asyncLib = require('async');

const models = require('../models');

const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* inscrit l'utilisateur si son email n'est pas déjà utilisé */
exports.signup = (req, res, then) => {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let isAdmin = 0;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'Missing parameters' });
    }
    if (username.length >= 25 || username.length <= 4) {
        return res.status(400).json({ 'error': 'Wrong username length' });
    }
    if (!/^[a-zA-Z]\w{4,25}$/.test(password)) {
        return res.status(400).json({ 'error': 'Wrong password content' });
    }

    if (regex.test(String(email).toLowerCase())) {
        models.User.findOne({ attributes: ['email'], where: { email: email } })
        .then(user => {
            if(!user) {
                bcrypt.hash(password, 10)
                .then(hash => {

                    models.User.create({
                        email: email,
                        username: username,
                        password: hash,
                        isAdmin: isAdmin
                    })
                    .then((newUser) => {
                        res.status(201).json({ message: 'User created : '+newUser.id})
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    });
                })
                .catch(error => res.status(500).json({ error }));
            } else {
                return res.status(401).json({ message: 'Action non autorisée !'});
            }
            
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        res.status(400).json({ message: 'Wrong email format !'});
    }
};

/* connecte un utilisateur grace a son email et son mot de passe */
exports.login = (req, res, then) => {
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters'});
    }
    
    if (regex.test(String(email).toLowerCase())) {
        models.User.findOne({ where: { email: email } })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'User not found !'});
            } else {
                bcrypt.compare(password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Wrong password !'});
                        }
                        res.status(200).json({
                            userId: user.id,
                            token: jwtUtils.generateToken(user)
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        res.status(401).json({ message: 'Action not allow !'});
    }
};

exports.getUserProfile = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'isAdmin'],
        where: { id: userId }
    })
    .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'error': 'User not found'});
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
}

exports.deleteUser = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'isAdmin'],
        where: { id: userId }
    })
    .then(user => {
        if (user) {
            asyncLib.waterfall([
                function (done) {
                    models.Message.findAll({ where: { UserId: userId }, attributes: ['id', 'UserId'] })
                    .then(messages => {
                        done(null, messages);
                    })
                    .catch(error => { return res.status(500).json({ error }); });
                },
                function (messages, done) {
                    if (messages.length > 0) {
                        //supprime tous les messages de l'utilisateur
                        models.Message.destroy({ where: { UserId: userId }})
                        .then(result => { 
                            console.log("message of user id="+userId+" destroyed !");
                            done(null, true);
                        })
                        .catch(error => {console.log('erreur destroy message'); return res.status(500).json({ error }); });
                    }
                },
                function (executed, done) {
                    if (executed) {
                        models.Comment.findAll({ where: { UserId: userId }, attributes: ['id', 'parent']})
                        .then(comments => {
                            done(null, comments);
                        })
                        .catch(error => {
                            console.log("erreur get all comment : "+error); 
                            return res.status(500).json({ error }); 
                        });
                    }
                },
                function (comments, done) {
                    var commentsListComplet = [];
                    if (comments.length > 0) {
                        for(commentActif of comments) {
                            models.Comment.findAll({ where: { parent: commentActif.id }, attributes: ['id', 'parent']})
                            .then(response => {
                                if (response.length > 0) {
                                    comments = comments.concat(response);
                                }
                                commentsListComplet.push(commentActif);
                            })
                            .catch(error => { 
                                console.log('erreur get comment '+error); 
                                return res.status(501).json({ error });  
                            });
                        };
                        done(null, commentsListComplet);
                    } else {
                        done(null, []);
                    }
                },
                function (commentListe, done) {
                    if (commentListe.length > 0) {
                        models.Comment.destroy({ where: { id: commentsListe[i].id } })
                        .then((result) => { 
                            console.log('comment destroyed '+commentsListe[i].id+' + '+result);
                            done(null, true);
                        })
                        .catch(error => { 
                            return res.status(500).json({ error });  
                        }); 
                    } else {
                        done(null, true);
                    }
                },
                function (destroyed, done) {
                    if (destroyed) {
                        models.Like.findAll({ where: { UserId: userId }, attributes: ['id', 'messageId', 'likeType']})
                        .then(likes => {
                            done(null, likes);
                        })
                        .catch(error => { return res.status(500).json({ error }); })
                    }
                },
                function (likes, done) {
                    if (likes.length > 0) {
                        for (let i = 0; i < likes.length; i++) {
                            if (likes[i].likeType == -1) {
                                models.Message.findOne({ where: { id: likes[i].messageId}})
                                .then(message => {
                                    if (message) {
                                        message.update({
                                            likes: message.likes + 1
                                        })
                                        .then(()=> {})
                                        .catch(error => { return res.status(503).json({ error }); }); 
                                    }
                                })
                            } else if (likes[i].likeType == 1) {
                                models.Message.findOne({ where: { id: likes[i].messageId}})
                                .then(message => {
                                    if (message) {
                                        message.update({
                                            likes: message.likes - 1
                                        })
                                        .then(()=> {})
                                        .catch(error => { return res.status(502).json({ error }); }); 
                                    }
                                })
                            }
                        }
                        done(null, true);
                    }
                },
                function (executed, done) {
                    if (executed) {
                        models.Like.destroy({ where: { UserId: userId } })
                        .then(() => { 
                            done('all_destroyed');
                        })
                        .catch(error => {
                            console.log('erreur destroy like'); 
                        return res.status(501).json({ error }); 
                    });
                    }
                },
            ], function (params) {
                if (params == 'all_destroyed') {
                    models.User.destroy({ where: { id: userId } })
                    .then(oldUser => {
                        if (oldUser) {
                            return res.status(200).json({ message: 'user delete !'});
                        } else {
                            return res.status(404).json({ 'error': 'user not found !'});
                        }
                    })
                    .catch(error => {console.log('erreur destroy user'); return res.status(500).json({ error }); })
                }
            });
        } else {
            return res.status(404).json({ 'error': 'User not found'});
        }
    })
    .catch(error => {
        return res.status(500).json({ error });
    })
};


exports.getUserListe = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'isAdmin'],
        where: { id: userId }
    })
        .then(user => {
            if (user) {
                if (user.isAdmin) {
                    models.User.findAll({attributes: [ 'id', 'email', 'username', 'isAdmin'], order: [['username', 'ASC']]})
                    .then(users => {
                        res.status(200).json(users);
                    })
                    .catch(error => { res.status(500).json({ error})});
                } else {
                    res.status(401).json({'error': 'User is not an admin !'});
                }
                
            } else {
                res.status(404).json({ 'error': 'User not found'});
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
}


exports.adminGetUserProfile = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    var userQuery = parseInt(req.params.id);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    if ( isNaN(userQuery) || userQuery < 0) {
        return res.status(401).json({ 'error': 'Invalid argument !'});
    }

    models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
    .then(admin => {
        if (admin) {
            if (admin.isAdmin) {
                models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin', 'createdAt'], 
                where: { id: userQuery },
                include: [{
                    model: models.Message,
                    attributes: ['id', 'title', 'content', 'createdAt'],
                    order: [['id', 'DESC']],
                    limit: 5
                },
                {
                    model: models.Comment,
                    attributes: ['messageId', 'content', 'createdAt'],
                    order: [['id', 'DESC']],
                    limit: 5
                }]})
                .then(user => {
                    if (user) {
                        res.status(200).json(user);
                    } else {
                        res.status(404).json({ 'error': 'User not found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ error });
                })
            }

            
        } else {
            res.status(404).json({ 'error': 'User not found'});
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
}


exports.adminDeleteUserProfile = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    var userQuery = parseInt(req.params.id);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action not allow !'});
    }
    if ( isNaN(userQuery) || userQuery < 0) {
        return res.status(401).json({ 'error': 'Invalid argument !'});
    }

    models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin'], where: { id: userId } })
    .then(admin => {
        if (admin) {
            if (admin.isAdmin) {
                models.User.findOne({ attributes: [ 'id', 'email', 'username', 'isAdmin', 'createdAt'], 
                where: { id: userQuery },
                include: [{
                    model: models.Message,
                    attributes: ['id', 'title', 'content', 'createdAt']
                },
                {
                    model: models.Comment,
                    attributes: ['messageId', 'content', 'createdAt']
                }]})
                .then(user => {
                    if (user) {
                        res.status(200).json(user);
                    } else {
                        res.status(404).json({ 'error': 'User not found'});
                    }
                })
                .catch(error => {
                    res.status(500).json({ error });
                })
            }
// destroy({ cascade: true });
            
        } else {
            res.status(404).json({ 'error': 'User not found'});
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
}
