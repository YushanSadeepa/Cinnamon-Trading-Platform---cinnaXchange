import { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Cinnamon Marketplace
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl p-4 shadow"
          >
            <h2 className="font-bold text-lg">
              {product.title}
            </h2>

            <p>{product.grade}</p>

            <p>{product.quantity} KG</p>

            <p>Rs. {product.price}</p>

            <p>{product.location}</p>

            {product.isBuyNow && (
              <button className="bg-green-600 text-white px-4 py-2 rounded mt-2">
                Buy Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}