const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt');

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
            //recherche tous les messages de l'utilisateur et supprime les likes et les comments 
            //de ces messages
            models.Message.findAll({ where: { UserId: userId }, attributes: ['id', 'UserId'] })
            .then(messages => {
                if (messages.length > 0) {
                    for (let i = 0; i < messages.length; i++) {
                        models.Like.destroy({ where: { messageId: messages[i].id }})
                        .then(()=> {
                            console.log("likes of message id="+messages[i].id+" destroyed")
                        })
                        .catch(error => { res.status(500).json({ error }); }); 
                        models.Comment.destroy({ where: { messageId: messages[i].id }})
                        .then(()=> {
                            console.log("Comments of message id="+messages[i].id+" destroyed")
                        })
                        .catch(error => { res.status(500).json({ error }); }); 
                    }
                    //supprime tous les messages de l'utilisateur
                    models.Message.destroy({ where: { UserId: userId }})
                    .then(result => { console.log("message of user id="+userId+" destroyed !")})
                    .catch(error => { res.status(500).json({ error }); });
                }
                var commentsListe = [];
                let commentNeedDestroy= [];
                // recherche les commentaire de l'utilisateur ainsi que les commentaires
                // enfant de ces derniers et les supprimes
                models.Comment.findAll({ where: { UserId: userId }, attributes: ['id', 'parent']})
                .then(comments => {
                    if (comments.length > 0) {
                        while (comments.length > 0) {
                            commentsListe = comments;
                            for (const element in commentsListe ) {
                                models.Comment.findAll({ where: { parentId: element.id }, attributes: ['id', 'parent']})
                                .then(response => {
                                    if (response.length > 0) {
                                        comments = comments.concat(response);
                                    }
                                })
                                .catch(error => { res.status(500).json({ error }); }); 
                                commentNeedDestroy.push(element.id);
                                comments.splice(comments.indexOf(element.id), 1);
                            };
                        }
                        models.Comment.destroy({ where: { id: commentNeedDestroy } })
                        .then(() => { console.log('comment destroyed');})
                        .catch(error => { res.status(500).json({ error }); }); 
                    }
                    models.Like.findAll({ where: { UserId: userId }, attributes: ['id', 'messageId', 'likeType']})
                    .then(likes => {
                        if (likes.length > 0) {
                            for (const like in likes) {
                                if (like.likeType == -1) {
                                    models.Message.findOne({ where: { id: like.messageId}})
                                    .then(message => {
                                        if (message) {
                                            message.update({
                                                likes: message.likes + 1
                                            })
                                            .then(()=> { })
                                            .catch(error => { return res.status(500).json({ error })});
                                        }
                                    })
                                } else if (like.likeType == 1) {
                                    models.Message.findOne({ where: { id: like.messageId}})
                                    .then(message => {
                                        if (message) {
                                            message.update({
                                                likes: message.likes - 1
                                            })
                                            .then(()=> { })
                                            .catch(error => { return res.status(500).json({ error })});
                                        }
                                    })
                                }
                            }
                            models.Like.destroy({ where: { UserId: userId } })
                            .then(() => {  })
                            .catch(error => { res.status(500).json({ error }); })
                        }
                        // supprime l'utilisateur
                        models.User.destroy({ where: { id: userId } })
                        .then(oldUser => {
                            if (oldUser) {
                                res.status(200).json({ message: 'user delete !'});
                            } else {
                                res.status(404).json({ 'error': 'user not found !'});
                            }
                        })
                        .catch(error => { res.status(500).json({ error }); })
                    })
                    .catch(error => { res.status(500).json({ error }); })
                })
                .catch(error => { res.status(500).json({ error }); });
            })
            .catch(error => { res.status(500).json({ error }); });  
            
        } else {
            res.status(404).json({ 'error': 'User not found'});
        }
    })
    .catch(error => {
        res.status(500).json({ error });
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
                    models.User.findAll({attributes: [ 'id', 'email', 'username', 'isAdmin']})
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
