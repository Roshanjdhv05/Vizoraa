import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Compass, Bookmark, PlusSquare, LogOut, CreditCard, ChevronRight, X, Crown, Flame, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Sidebar = ({ session, isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            onClick={onClose} // Close sidebar on mobile when item clicked
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                    ? 'bg-gradient-to-r from-[#7B4BFF] to-[#A07BFF] text-white shadow-lg shadow-purple-200 scale-[1.02]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:scale-[1.02]'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{label}</span>
            <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${window.location.pathname === to ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`} />
        </NavLink>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-8 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[#7B4BFF]">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B4BFF] to-[#A07BFF] flex items-center justify-center text-white shadow-lg shadow-purple-200">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">Vizoraa</span>
                    </div>

                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-50 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 px-6 flex flex-col gap-2 overflow-y-auto py-4 custom-scrollbar">
                    <NavItem to="/" icon={Compass} label="Browse Cards" />
                    <NavItem to="/offers" icon={Flame} label="Offers" />
                    <NavItem to="/privacy-policy" icon={Shield} label="Privacy Policy" />
                    {session && (
                        <>
                            <NavItem to="/dashboard" icon={LayoutGrid} label="Dashboard" />
                            <NavItem to="/saved" icon={Bookmark} label="Saved Cards" />
                            <NavItem to="/create-card" icon={PlusSquare} label="Create Card" />
                            <div className="pt-2">
                                <NavLink
                                    to="/premium"
                                    onClick={onClose}
                                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:scale-[1.02]'}`}
                                >
                                    <Crown className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-sm">Upgrade to Gold</span>
                                </NavLink>
                            </div>
                        </>
                    )}
                </div>

                {/* User Profile / Logout */}
                <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                    {session ? (
                        <>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-[#7B4BFF] font-bold border-2 border-white shadow-sm">
                                    {session.user.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {session.user.user_metadata?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm group"
                            >
                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <NavLink to="/login" className="w-full py-3 rounded-xl border border-gray-200 text-slate-600 font-bold text-sm text-center hover:border-slate-300 transition-colors">
                                Log In
                            </NavLink>
                            <NavLink to="/signup" className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm text-center shadow-lg hover:bg-black transition-all">
                                Get Started
                            </NavLink>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
