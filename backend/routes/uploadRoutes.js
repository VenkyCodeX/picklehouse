const router = require('express').Router();
const { uploadMiddleware, uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, uploadMiddleware, uploadImage);

module.exports = router;
