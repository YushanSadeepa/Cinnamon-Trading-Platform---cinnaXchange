import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";

export const buyNow = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!product.isBuyNow) {
      return res.status(400).json({
        message: "Buy Now not available",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    const totalPrice =
      product.buyNowPrice * quantity;

    const purchase = await Purchase.create({
      buyer: req.user.id,
      product: productId,
      quantity,
      totalPrice,
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      purchase,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};