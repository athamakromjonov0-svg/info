import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|svg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Faqat rasm fayllari (jpg, png, webp, svg) yuklanishi mumkin!"));
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Fayl yuklanmadi" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    message: "Fayl muvaffaqiyatli yuklandi",
    url: fileUrl,
    filename: req.file.filename,
  });
};
