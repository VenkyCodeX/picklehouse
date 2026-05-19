const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getReviews = async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.product) filter.product = req.query.product;
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user?._id, name: req.user?.name || req.body.name });
    if (req.body.product) {
      const reviews = await Review.find({ product: req.body.product, isApproved: true });
      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(req.body.product, { ratings: avg.toFixed(1), numReviews: reviews.length });
    }
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.seedReviews = async (req, res) => {
  try {
    const reviews = [
      { name: 'Priya Reddy', location: 'Hyderabad', rating: 5, comment: 'Best pickles I have ever tasted! The mango pickle is absolutely divine. Pure sesame oil taste is unmatched. Ordering every month now!', isGoogleReview: true },
      { name: 'Suresh Kumar', location: 'USA (NRI)', rating: 5, comment: 'I am in the US and Pickle House ships internationally. The packaging is excellent — vacuum sealed and leak proof. Tastes exactly like home!', isGoogleReview: true },
      { name: 'Lakshmi Devi', location: 'Bangalore', rating: 5, comment: 'The gongura pickle is out of this world. No preservatives and you can actually taste the difference. My whole family loves it!', isGoogleReview: true },
      { name: 'Ravi Shankar', location: 'UK (NRI)', rating: 5, comment: 'Ordered for my parents in Hyderabad and they loved it. The without-garlic options are perfect for our Jain family. Highly recommended!', isGoogleReview: true },
      { name: 'Anitha Varma', location: 'Hyderabad', rating: 5, comment: 'Authentic homemade taste. The kandi podi and idli karam are staples in our house now. Quality is consistently excellent every time.', isGoogleReview: true },
    ];
    await Review.deleteMany({ isGoogleReview: true });
    await Review.insertMany(reviews);
    res.json({ message: 'Reviews seeded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
