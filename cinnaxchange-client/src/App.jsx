import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Shared
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Buyer
import Marketplace from "./pages/Marketplace";
import AuctionList from "./pages/buyer/AuctionList";
import AuctionRoom from "./pages/buyer/AuctionRoom";
import MyBids from "./pages/buyer/MyBids";
import WonAuctions from "./pages/buyer/WonAuctions";
import SellerProfile from "./pages/buyer/SellerProfile";
import BuyerReviews from "./pages/buyer/BuyerReviews";

// Seller
import CreateListing from "./pages/seller/CreateListing";
import EditListing from "./pages/seller/EditListing";
import MyProducts from "./pages/MyProducts";
import CreateAuction from "./pages/seller/CreateAuction";
import MyAuctions from "./pages/seller/MyAuctions";
import AwaitingMeetings from "./pages/seller/AwaitingMeetings";
import CompletedSales from "./pages/seller/CompletedSales";
import TrustScore from "./pages/seller/TrustScore";
import KYCSubmit from "./pages/seller/KYCSubmit";

// Admin — all imported directly from AdminPages (no stub files needed)
import {
  AdminUsers,
  AdminListings,
  AdminAuctions,
  AdminComplaints,
  AdminVerification,
} from "./pages/admin/AdminPages";

// Legacy
import Products from "./pages/Products";

const Buyer  = ({ children }) => <ProtectedRoute allowedRoles={["buyer"]}>{children}</ProtectedRoute>;
const Seller = ({ children }) => <ProtectedRoute allowedRoles={["seller"]}>{children}</ProtectedRoute>;
const Admin  = ({ children }) => <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
const Auth   = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/products"     element={<Marketplace />} />
        <Route path="/all-products" element={<Products />} />
        <Route path="/"             element={<Navigate to="/login" replace />} />

        {/* Shared protected */}
        <Route path="/dashboard" element={<Auth><Dashboard /></Auth>} />
        <Route path="/profile"   element={<Auth><Profile /></Auth>} />

        {/* Buyer */}
        <Route path="/auctions"      element={<Buyer><AuctionList /></Buyer>} />
        <Route path="/auction/:id"   element={<Auth><AuctionRoom /></Auth>} />
        <Route path="/my-bids"       element={<Buyer><MyBids /></Buyer>} />
        <Route path="/won-auctions"  element={<Buyer><WonAuctions /></Buyer>} />
        <Route path="/seller/:id"    element={<Buyer><SellerProfile /></Buyer>} />
        <Route path="/my-reviews"    element={<Buyer><BuyerReviews /></Buyer>} />

        {/* Seller */}
        <Route path="/create-listing"    element={<Seller><CreateListing /></Seller>} />
        <Route path="/edit-listing/:id"  element={<Seller><EditListing /></Seller>} />
        <Route path="/my-products"       element={<Seller><MyProducts /></Seller>} />
        <Route path="/create-auction"    element={<Seller><CreateAuction /></Seller>} />
        <Route path="/my-auctions"       element={<Seller><MyAuctions /></Seller>} />
        <Route path="/awaiting-meetings" element={<Seller><AwaitingMeetings /></Seller>} />
        <Route path="/completed-sales"   element={<Seller><CompletedSales /></Seller>} />
        <Route path="/trust-score"       element={<Seller><TrustScore /></Seller>} />
        <Route path="/kyc"               element={<Seller><KYCSubmit /></Seller>} />

        {/* Admin */}
        <Route path="/admin/users"        element={<Admin><AdminUsers /></Admin>} />
        <Route path="/admin/listings"     element={<Admin><AdminListings /></Admin>} />
        <Route path="/admin/auctions"     element={<Admin><AdminAuctions /></Admin>} />
        <Route path="/admin/complaints"   element={<Admin><AdminComplaints /></Admin>} />
        <Route path="/admin/verification" element={<Admin><AdminVerification /></Admin>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
