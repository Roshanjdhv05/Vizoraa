import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ViewCard from './pages/ViewCard';
import CreateCard from './pages/CreateCard';
import EditCard from './pages/EditCard';
import SavedCards from './pages/SavedCards';
import Premium from './pages/Premium';
import Offers from './pages/Offers';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Components
import AdminLayout from './components/Admin/AdminLayout';
import AdminProtectedRoute from './components/Admin/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCards from './pages/admin/AdminCards';
import AdminAds from './pages/admin/AdminAds';
import AdminPremium from './pages/admin/AdminPremium';
import { Outlet } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="premium" element={<AdminPremium />} />
              <Route path="cards" element={<AdminCards />} />
              <Route path="ads" element={<AdminAds />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Public/User Routes wrapped in MainLayout */}
          <Route element={<MainLayout session={session}><Outlet /></MainLayout>}>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={session ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/saved"
              element={session ? <SavedCards /> : <Navigate to="/login" />}
            />
            <Route
              path="/premium"
              element={session ? <Premium /> : <Navigate to="/login" />}
            />
            <Route
              path="/create-card"
              element={session ? <CreateCard /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!session ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!session ? <Signup /> : <Navigate to="/dashboard" />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/edit-card/:id"
              element={session ? <EditCard /> : <Navigate to="/login" />}
            />
            <Route path="/offers" element={<Offers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/c/:id" element={<ViewCard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
