
exports.uploadImage = (req, res ,then) => {
    var image = `${req.protocol}://${req.get('host')}/userImg/${req.file.filename}`;

    return res.status(201).json({location: image})
 }