const models = require('../models');
const jwtUtils = require('../utils/jwt');

exports.likeMessage = (req, res, then ) => {
    //
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0) {
        return res.status(401).json({ 'error': 'Action non autorisée !'});
    }

    var messageId = parseInt(req.params.id);
    var likeValue = parseInt(req.params.likeType);
    if (messageId <= 0 || likeValue < -1 || likeValue > 1) {
        return res.status(400).json({ 'error': ' Invalid request !' });
    }
    // vérifie l'existence du message
    models.Message.findOne({ where: { id: messageId } })
    .then(message => {
        if (message) {
            //vérifie l'existence de l'utilisateur
            models.User.findOne({ where: {id: userId }})
            .then(user => {
                if (user) {
                    //vérifie si l'utilisateur a déjà like
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId: messageId
                        }
                    })
                    .then(like => {
                        if (!like && likeValue != 0) {
                            //
                            message.addUsers(user, { likeType: likeValue })
                            .then(() => {
                                //
                                switch (likeValue) {
                                    case -1:
                                        message.update({
                                            likes: message.likes - 1
                                        })
                                        .then(()=> {
                                            //
                                            return res.status(201).json(message);
                                        })
                                        .catch(error => { return res.status(500).json({ error })});
                                        break;
                                    case 1:
                                        message.update({
                                            likes: message.likes + 1
                                        })
                                        .then(()=> {
                                            //
                                            return res.status(201).json(message);
                                        })
                                        .catch(error => { return res.status(500).json({ error })});
                                        break;
                                    default:
                                        return res.status(500).json({ 'error': 'Error null like !' });
                                        break;
                                }
                                
                            })
                            .catch(error => { return res.status(500).json({ error })});
                        } else if (!like && likeValue == 0) {
                            return res.status(400).json({ 'error': 'Error null like !' });
                        } else {
                            //si il a déjà like
                            if (like.likeType != likeValue) {
                                message.addUsers(user, { likeType: 1})
                                .then(() => {
                                    switch (likeValue) {
                                        case -1:
                                            message.update({
                                                likes: message.likes - 2
                                            })
                                            .then(()=> {
                                                //
                                                return res.status(201).json(message);
                                            })
                                            .catch(error => { return res.status(500).json({ error })});
                                        break;
                                        case 0:
                                            like.destroy()
                                                .then(() => {
                                                    return res.status(201).json({ 'message': 'like aborded !'});
                                                })
                                                .catch(error => { return res.status(500).json({ error })});
                                        break;
                                        case 1:
                                            message.update({
                                                likes: message.likes + 2
                                            })
                                            .then(()=> {
                                                //
                                                return res.status(201).json(message);
                                            })
                                            .catch(error => { return res.status(500).json({ error })});
                                        break;          
                                        default:
                                            return res.status(500).json({ 'error': 'like error !'});
                                            break;
                                    }
                                })
                                .catch(error => { return res.status(500).json({ error })});
                            } else {
                                res.status(409).json({ 'error': 'already liked !'});
                            }
                        }
                    })
                    .catch(error => { return res.status(500).json({ error })});
                }

            })
            .catch(error => { return res.status(500).json({ error })});
        }
            
        
    })
    .catch(error => { return res.status(500).json({ error })});
}

exports.dislike =( req, res, then ) => {
    //
}


