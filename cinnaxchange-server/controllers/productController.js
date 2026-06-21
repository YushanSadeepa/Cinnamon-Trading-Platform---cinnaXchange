import Product from "../models/Product.js";

// GET /api/products — public marketplace listing
export const getProducts = async (req, res) => {
  try {
    const { grade, cinnamonType, minPrice, maxPrice, search, sellerId } = req.query;
    const filter = { status: "active" };

    if (sellerId) filter.seller = sellerId;
    if (grade) filter.grade = grade;
    if (cinnamonType) filter.cinnamonType = new RegExp(cinnamonType, "i");
    if (search) filter.title = new RegExp(search, "i");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("seller", "fullName ratings trustScore isVerified location")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "fullName ratings trustScore isVerified location mobile"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/my-products — seller's own products
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products — seller creates listing
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      cinnamonType,
      grade,
      quantity,
      price,
      dryingDays,
      description,
      location,
      latitude,
      longitude,
      isBuyNow,
      isAuction,
    } = req.body;

    // images: multer will populate req.files — build full URL for client access
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const images = req.files ? req.files.map((f) => `${baseUrl}/uploads/products/${f.filename}`) : [];

    const product = await Product.create({
      seller: req.user.id,
      title,
      cinnamonType,
      grade,
      quantity: Number(quantity),
      price: Number(price),
      dryingDays: Number(dryingDays) || 0,
      description,
      images,
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      isBuyNow: isBuyNow === "true" || isBuyNow === true,
      isAuction: isAuction === "true" || isAuction === true,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id — seller updates listing
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      updates.images = req.files.map((f) => `${baseUrl}/uploads/products/${f.filename}`);
    }

    Object.assign(product, updates);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
