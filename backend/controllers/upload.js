
exports.uploadImage = (req, res ,then) => {

    var image = `${req.protocol}://${req.get('host')}/userImg/${req.file.filename}`;

    return res.status(200).json({location: image})
    //return url image avec status 200
    
 }