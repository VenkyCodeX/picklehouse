const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, withoutGarlic, featured, all } = req.query;
    const filter = {}; 
    if (all !== 'true') filter.isActive = true;
    if (category && category !== 'all') filter.category = category;
    if (withoutGarlic === 'true') filter.isWithoutGarlic = true;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { nameTelugu: { $regex: search, $options: 'i' } },
    ];
    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    // try update by ObjectId first, fall back to slug if not found
    let product = null;
    try {
      product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    } catch (castErr) {
      // invalid ObjectId or cast error - ignore and try slug
    }
    if (!product) {
      product = await Product.findOneAndUpdate({ slug: req.params.id }, updateData, { new: true, runValidators: true });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const products = [
      // PICKLES
      { name: 'Mango Pickle', nameTelugu: 'మామిడి పచ్చడి', category: 'pickle', description: 'Classic Hyderabadi mango pickle made with pure sesame oil', prices: [{ weight: '250g', price: 120 }, { weight: '500g', price: 220 }, { weight: '1kg', price: 400 }], isWithoutGarlic: false, featured: true, images: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400'] },
      { name: 'Gongura Pickle', nameTelugu: 'గోంగూర పచ్చడి', category: 'pickle', description: 'Tangy sorrel leaves pickle — Andhra specialty', prices: [{ weight: '250g', price: 130 }, { weight: '500g', price: 240 }, { weight: '1kg', price: 450 }], isWithoutGarlic: false, featured: true, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'] },
      { name: 'Tomato Pickle', nameTelugu: 'టొమాటో పచ్చడి', category: 'pickle', description: 'Fresh tomato pickle with traditional spices', prices: [{ weight: '250g', price: 100 }, { weight: '500g', price: 190 }, { weight: '1kg', price: 360 }], isWithoutGarlic: true, featured: true, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'] },
      { name: 'Lemon Pickle', nameTelugu: 'నిమ్మకాయ పచ్చడి', category: 'pickle', description: 'Zesty lemon pickle — perfect with rice', prices: [{ weight: '250g', price: 110 }, { weight: '500g', price: 200 }, { weight: '1kg', price: 380 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Tamarind Pickle', nameTelugu: 'చింతకాయ పచ్చడి', category: 'pickle', description: 'Tangy tamarind pickle with sesame oil', prices: [{ weight: '250g', price: 115 }, { weight: '500g', price: 210 }, { weight: '1kg', price: 390 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Ginger Pickle', nameTelugu: 'అల్లం పచ్చడి', category: 'pickle', description: 'Spicy ginger pickle with traditional recipe', prices: [{ weight: '250g', price: 120 }, { weight: '500g', price: 220 }, { weight: '1kg', price: 400 }], isWithoutGarlic: true, featured: true, images: [] },
      { name: 'Pandumirchi Pickle', nameTelugu: 'పండుమిర్చి పచ్చడి', category: 'pickle', description: 'Red chilli pickle — fiery and flavorful', prices: [{ weight: '250g', price: 130 }, { weight: '500g', price: 240 }, { weight: '1kg', price: 450 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Usiri Pickle', nameTelugu: 'ఉసిరికాయ పచ్చడి', category: 'pickle', description: 'Amla/gooseberry pickle rich in Vitamin C', prices: [{ weight: '250g', price: 125 }, { weight: '500g', price: 230 }, { weight: '1kg', price: 420 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Kakarakaya Pickle', nameTelugu: 'కాకరకాయ పచ్చడి', category: 'pickle', description: 'Bitter gourd pickle — healthy and tasty', prices: [{ weight: '250g', price: 120 }, { weight: '500g', price: 220 }, { weight: '1kg', price: 400 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Cauliflower Pickle', nameTelugu: 'కాలీఫ్లవర్ పచ్చడి', category: 'pickle', description: 'Crunchy cauliflower pickle with spices', prices: [{ weight: '250g', price: 115 }, { weight: '500g', price: 210 }, { weight: '1kg', price: 390 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Magaya Pickle', nameTelugu: 'మాగాయ పచ్చడి', category: 'pickle', description: 'Traditional raw mango pickle — Andhra style', prices: [{ weight: '250g', price: 130 }, { weight: '500g', price: 240 }, { weight: '1kg', price: 450 }], isWithoutGarlic: false, featured: true, images: [] },
      { name: 'Kothimeera Pickle', nameTelugu: 'కొత్తిమేర పచ్చడి', category: 'pickle', description: 'Fresh coriander pickle with sesame oil', prices: [{ weight: '250g', price: 110 }, { weight: '500g', price: 200 }, { weight: '1kg', price: 380 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Pudina Pickle', nameTelugu: 'పుదీన పచ్చడి', category: 'pickle', description: 'Refreshing mint pickle', prices: [{ weight: '250g', price: 110 }, { weight: '500g', price: 200 }, { weight: '1kg', price: 380 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Velluli Pickle', nameTelugu: 'వెల్లులి పచ్చడి', category: 'pickle', description: 'Garlic pickle — bold and aromatic', prices: [{ weight: '250g', price: 140 }, { weight: '500g', price: 260 }, { weight: '1kg', price: 480 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Allam Mamidi Pickle', nameTelugu: 'అల్లం మామిడి పచ్చడి', category: 'pickle', description: 'Ginger mango combo pickle', prices: [{ weight: '250g', price: 130 }, { weight: '500g', price: 240 }, { weight: '1kg', price: 450 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Bellam Mamidi Pickle', nameTelugu: 'బెల్లం మామిడి పచ్చడి', category: 'pickle', description: 'Sweet jaggery mango pickle', prices: [{ weight: '250g', price: 125 }, { weight: '500g', price: 230 }, { weight: '1kg', price: 420 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Mamidi Thokku', nameTelugu: 'మామిడి తొక్కు', category: 'pickle', description: 'Mango skin pickle — zero waste traditional recipe', prices: [{ weight: '250g', price: 120 }, { weight: '500g', price: 220 }, { weight: '1kg', price: 400 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Muvvala Mamidi Pickle', nameTelugu: 'మువ్వల మామిడి పచ్చడి', category: 'pickle', description: 'Small mango pickle — whole baby mangoes', prices: [{ weight: '250g', price: 135 }, { weight: '500g', price: 250 }, { weight: '1kg', price: 460 }], isWithoutGarlic: false, featured: false, images: [] },
      // POWDERS
      { name: 'Velluli Karam', nameTelugu: 'వెల్లులి కారం', category: 'powder', description: 'Garlic spice powder — great with idli/dosa', prices: [{ weight: '250g', price: 90 }, { weight: '500g', price: 170 }], isWithoutGarlic: false, featured: true, images: [] },
      { name: 'Karivepaku Karam', nameTelugu: 'కరివేపాకు కారం', category: 'powder', description: 'Curry leaf powder — aromatic and healthy', prices: [{ weight: '250g', price: 85 }, { weight: '500g', price: 160 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Idli Karam', nameTelugu: 'ఇడ్లీ కారం', category: 'powder', description: 'Perfect idli powder blend', prices: [{ weight: '250g', price: 80 }, { weight: '500g', price: 150 }], isWithoutGarlic: true, featured: true, images: [] },
      { name: 'Palli Karam', nameTelugu: 'పల్లీ కారం', category: 'powder', description: 'Peanut spice powder', prices: [{ weight: '250g', price: 90 }, { weight: '500g', price: 170 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Kandi Podi', nameTelugu: 'కంది పొడి', category: 'powder', description: 'Toor dal powder — Andhra staple', prices: [{ weight: '250g', price: 85 }, { weight: '500g', price: 160 }], isWithoutGarlic: true, featured: true, images: [] },
      { name: 'Sambar Podi', nameTelugu: 'సాంబారు పొడి', category: 'powder', description: 'Authentic sambar masala powder', prices: [{ weight: '250g', price: 90 }, { weight: '500g', price: 170 }], isWithoutGarlic: false, featured: false, images: [] },
      { name: 'Rasam Podi', nameTelugu: 'రసం పొడి', category: 'powder', description: 'Traditional rasam powder', prices: [{ weight: '250g', price: 85 }, { weight: '500g', price: 160 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Nuvvundalu', nameTelugu: 'నువ్వుండలు', category: 'sweet', description: 'Sesame seed balls — traditional sweet', prices: [{ weight: '250g', price: 100 }, { weight: '500g', price: 190 }], isWithoutGarlic: true, featured: true, images: [] },
      // OTHER
      { name: 'Pure Ghee', nameTelugu: 'నెయ్యి', category: 'ghee', description: 'Pure cow ghee — traditional preparation', prices: [{ weight: '250g', price: 280 }, { weight: '500g', price: 540 }, { weight: '1kg', price: 1050 }], isWithoutGarlic: true, featured: true, images: [] },
      { name: 'Honey', nameTelugu: 'తేనె', category: 'other', description: 'Pure natural honey', prices: [{ weight: '250g', price: 200 }, { weight: '500g', price: 380 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Tea Powder', nameTelugu: 'తేపొడి', category: 'tea', description: 'Premium Hyderabadi tea blend', prices: [{ weight: '250g', price: 120 }, { weight: '500g', price: 230 }], isWithoutGarlic: true, featured: false, images: [] },
      { name: 'Pulihora Paste', nameTelugu: 'పులిహోర పేస్ట్', category: 'other', description: 'Ready-to-use tamarind rice paste', prices: [{ weight: '250g', price: 110 }, { weight: '500g', price: 200 }], isWithoutGarlic: false, featured: true, images: [] },
      { name: 'Allam Velluli Paste', nameTelugu: 'అల్లం వెల్లులి పేస్ట్', category: 'other', description: 'Fresh ginger garlic paste', prices: [{ weight: '250g', price: 90 }, { weight: '500g', price: 170 }], isWithoutGarlic: false, featured: false, images: [] },
    ];
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    res.json({ message: `${created.length} products seeded`, count: created.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
