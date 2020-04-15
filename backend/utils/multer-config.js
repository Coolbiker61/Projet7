const multer = require('multer');

const MINE_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    //'image/gif': 'gif'
}

/* transforme le chemin physique du fichier en url valide */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'userImg');
    },
    filename: (req, file, callback) => {
        console.log(file);
        var name = file.originalname.split(' ').join('_');
        if (name.includes('.jpg') || name.includes('.png')) {
            name = name.slice(0,-4);
        } else if ( name.includes('.jpeg')) {
            name = name.slice(0,-5);
        }
        const extension = MINE_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');