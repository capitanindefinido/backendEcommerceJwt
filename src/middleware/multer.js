const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = req.body.fileType;
        let uploadPath = '';

        if (fileType === 'documents') {
            uploadPath = 'C:/Users/HP OMEN/Documents/proyecto-ecommerce/src/files/documents';
        } else if (fileType === 'products') {
            uploadPath = 'C:/Users/HP OMEN/Documents/proyecto-ecommerce/src/files/products';
        } else if (fileType === 'profiles') {
            uploadPath = 'C:/Users/HP OMEN/Documents/proyecto-ecommerce/src/files/profiles';
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const finalFilePath = file.fieldname + '-' + uniqueSuffix + fileExtension
        cb(null, finalFilePath);
    },
});

const upload = multer({ storage });

module.exports = {
    upload,
    storage,
}