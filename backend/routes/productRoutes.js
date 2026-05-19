const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, seedProducts } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/admin/seed', protect, admin, seedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
