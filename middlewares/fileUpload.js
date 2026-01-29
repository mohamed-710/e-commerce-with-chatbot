import multer, { diskStorage } from 'multer';
import appError from '../utils/AppError.js';
import httpStatusText from '../utils/httpStatusText.js';

const uploadFileCloud = () => {

    const photostorage = diskStorage({}); //save file in system "temp"
    const fileFilter = (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(
                appError.create('File must be an image', 400, httpStatusText.FAIL),
                false
            );
        }
        return cb(null, true);
    };
    const multerUpload = multer({
        storage: photostorage,
        fileFilter,
    });
    return multerUpload;
};

export { uploadFileCloud };
