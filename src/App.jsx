import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ui/Toast.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './Pages/Home';
import About from './Pages/About';
import Profile from './components/UserComp/Profile';  
import Contact from './Pages/Contact';
import Artworks from './Pages/Artworks';

import Login from './components/UserComp/Login';
import Signup from './components/UserComp/SignUp';
import EditProfile from './components/UserComp/EditProfile';

import CreateEditArtworkPage from "./components/ArtCrud/CreateEditArtworkPage";
import PurchasePage from './Pages/PurchasePage';

import AdminDashboard from './components/adminComp/AdminDashboard';
import UserManagement from './components/adminComp/UserManagement';
import OrderList from './components/adminComp/OrderList';
import OrderDetail from './components/adminComp/OrderDetail';
import UserOrderList from './components/UserComp/UserOrderList';
import ArtworkManagement from './components/adminComp/ArtworkManagement';
import UserOrderDetail from './components/UserComp/UserOrderDetail'; 
import { useAuth } from './Firebase/AuthContext';

function AppContent() {
  const { user, loading, logout, error } = useAuth();

  useEffect(() => {
    if (error) {
      console.error('Error during authentication:', error); 
    }
  }, [error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <Router>
      <Navbar isAuthenticated={!!user} onLogout={logout} />



      <Routes>
        <Route path="/admin/artcrud/create-artwork" element={<CreateEditArtworkPage />} />
        <Route path="/admin/artcrud/edit-artwork/:id" element={<CreateEditArtworkPage />} />
        <Route path="/artwork-details/:id" element={<Artworks />} />
        <Route path="/purchase/:id" element={<PurchasePage />} />



        <Route path="/" element={<Home />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
        <Route path="/admin/artworks" element={<ArtworkManagement />} />
        <Route path="/users"  element={<UserManagement />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/my-orders"
          element={user ? <UserOrderList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/my-orders/:orderId"
          element={user ? <UserOrderDetail /> : <Navigate to="/" replace />}
        />
      </Routes>

    </Router>

  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
