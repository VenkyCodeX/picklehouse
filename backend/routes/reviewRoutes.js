const router = require('express').Router();
const { getReviews, createReview, seedReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', createReview);
router.post('/admin/seed', protect, admin, seedReviews);

module.exports = router;
