import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyProducts() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const res = await api.get("/products/my-products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Products
      </h1>

      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg p-4 mb-3"
        >
          <h2 className="font-bold">
            {product.title}
          </h2>

          <p>{product.quantity} KG</p>

          <p>Rs. {product.price}</p>

          <button
            onClick={() => deleteProduct(product._id)}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}