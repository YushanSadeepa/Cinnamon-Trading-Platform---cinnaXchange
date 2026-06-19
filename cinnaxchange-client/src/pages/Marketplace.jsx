import { useEffect, useState } from "react";
import api from "../services/api";

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Cinnamon Marketplace
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <h2 className="font-bold text-xl">
              {product.title}
            </h2>

            <p>Grade: {product.grade}</p>

            <p>Quantity: {product.quantity} kg</p>

            <p>Price: Rs. {product.price}</p>

            <p>
              Seller:
              {product.seller?.fullName}
            </p>

            {product.isBuyNow && (
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                Buy Now
              </button>
            )}

            {product.isAuction && (
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                View Auction
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}