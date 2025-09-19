const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require("../middleware/authMiddleware");
const { addListing, getAllListings, editListing, updateListing, disableListing, enableListing , getEnabledListings, getStats} = require('../controllers/listingsController');
const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (ext && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
  },
});


router.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
  }

  const photoPath = `/uploads/${req.file.filename}`;
  res.status(200).json({ photoPath });
});

router.delete('/delete-photo', (req, res) => {
  const { photoPath } = req.body;

  if (!photoPath) {
      return res.status(400).json({ success: false, message: 'No photo path provided' });
  }

  const filePath = path.join(__dirname, '..', photoPath); 

  fs.unlink(filePath, (err) => {
      if (err) {
         console.log(err);
          return res.status(500).json({ success: false, message: 'Failed to delete file' });
      }

      res.json({ success: true, message: 'File deleted successfully' });
  });
});

router.get('/', getAllListings);
router.get('/enabled', getEnabledListings);
router.get('/stats',authMiddleware,  getStats)
router.post('/', authMiddleware, addListing);
router.get('/:id', editListing);
router.put('/:id', updateListing);
router.put('/:id/disable', disableListing);
router.put('/:id/enable', enableListing);

module.exports = router;
