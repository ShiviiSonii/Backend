import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp') // specify the destination folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // use the original file name
    }
});

export const upload = multer({ 
    storage,
});
