import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Auction from "./pages/Auction";
import Products from "./pages/Products";
import MyProducts from "./pages/MyProducts";
import Marketplace from "./pages/Marketplace";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/all-products" element={<Products />} />
        <Route
  path="/products"
  element={<Marketplace />}
/>
        <Route
  path="/my-products"
  element={<MyProducts />}
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}