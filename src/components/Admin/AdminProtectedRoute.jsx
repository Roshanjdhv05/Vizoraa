import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const location = useLocation();

    // Check if the admin token exists in localStorage
    // In a real app, you would verify this token with the backend
    const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';

    if (!isAdmin) {
        // Redirect them to the /admin/login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
