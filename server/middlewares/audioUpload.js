const multer = require("multer");

const storage = multer.memoryStorage();

const audioUpload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "audio/webm",
            "audio/wav",
            "audio/x-wav",
            "audio/mpeg",
            "audio/mp4",
            "audio/ogg"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported audio format"), false);
        }
    }
});

module.exports = audioUpload;