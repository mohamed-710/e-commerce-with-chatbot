import multer, { diskStorage } from 'multer';
import appError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
// import fileType from "file-type";
import fs from 'fs/promises';
const uploadFileCloud = () => {

    const photostorage = diskStorage({}); //save file in system "temp"

    const fileFilter =(req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(
                appError.create
                    ('File must be an image', 400, httpStatusText.FAIL),
                false
            );
        }
        return cb(null, true);
    };  
    const multerUpload = multer({
        storage: photostorage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
        }
    });
    return multerUpload;
};
// const validateUploadedImage = async (filePath) => {
//     const buffer = await fs.readFile(filePath);
//     const type = await fileType.fromBuffer(buffer);
    
//     if (!type || !type.mime.startsWith('image/')) {
//         // Delete the invalid file
//         await fs.unlink(filePath);
//         throw appError.create('Invalid file signature', 400, httpStatusText.FAIL);
//     }
    
//     return type;
// };


export { uploadFileCloud};
