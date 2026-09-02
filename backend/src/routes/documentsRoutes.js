const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documentsController');

const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, STORAGE_DIR),
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
