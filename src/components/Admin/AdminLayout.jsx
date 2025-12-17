import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, MonitorPlay, LogOut, Menu, X, Crown } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isAdminAuthenticated');
            navigate('/admin/login');
        }
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                        Vizoraa<span className="text-slate-400 text-xs ml-1 font-mono align-top">ADMIN</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/admin/premium" icon={Crown} label="Premium Plans" />
                    <NavItem to="/admin/users" icon={Users} label="Users & Verification" />
                    <NavItem to="/admin/cards" icon={CreditCard} label="Cards & Filters" />
                    <NavItem to="/admin/ads" icon={MonitorPlay} label="Ads Management" />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
                <h1 className="text-xl font-bold text-slate-900">Vizoraa Admin</h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-4 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 pl-2">
                            <span className="font-bold text-lg">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X /></button>
                        </div>
                        <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem to="/admin/users" icon={Users} label="Users" />
                        <NavItem to="/admin/cards" icon={CreditCard} label="Cards" />
                        <NavItem to="/admin/ads" icon={MonitorPlay} label="Ads" />
                        <div className="mt-auto border-t pt-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen bg-[#F8FAFC]">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
