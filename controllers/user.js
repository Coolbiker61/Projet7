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
        return res.status(400).json({ 'error': 'missing parameters' });
    }
    if (username.length >= 25 || username.length <= 4) {
        return res.status(400).json({ 'error': 'wrong username length' });
    }
    if (!/^[a-zA-Z]\w{4,25}$/.test(password)) {
        return res.status(400).json({ 'error': 'wrong password' });
    }

    if (regex.test(String(email).toLowerCase())) {
        models.User.findOne({ attributes: ['email'], where: { email: email } })
        .then(user => {
            if(!user) {
                bcrypt.hash(password, 10)
                .then(hash => {

                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: hash,
                        isAdmin: isAdmin
                    })
                    .then((newUser) => {
                        res.status(201).json({ message: 'Utilisateur créé : '+newUser.id})
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
        res.status(401).json({ message: 'Action non autorisée !'});
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
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                bcrypt.compare(password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !'});
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwtUtils.generateToken(user)
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        res.status(401).json({ message: 'Action non autorisée !'});
    }
};

exports.getUserProfile = (req, res, then) => {
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }
    models.User.findOne({
        attributes: [ 'id', 'email', 'username', 'isAdmin'],
        where: { id: userId }
    })
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found'});
            }
        })
        .catch(error => {
            res.status(500).json({ 'error': error });
        })
}

exports.deleteUser = (req, res, then) => {
    //
}