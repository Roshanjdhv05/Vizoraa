import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Menu, User, LogOut, Bookmark } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Navbar = ({ session }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                    <CreditCard className="w-6 h-6" />
                    <span>Vizoraa</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">Home</Link>
                    <div className="bg-gray-200 h-6 w-[1px]"></div>

                    {session ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</Link>
                            <Link to="/saved" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                                <Bookmark className="w-4 h-4" />
                                <span>Saved</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium ml-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                {session.user.email ? session.user.email[0].toUpperCase() : 'U'}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                        </>
                    )}
                </div>

                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl md:hidden animate-slideIn flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-xl text-indigo-600 flex items-center gap-2">
                                <CreditCard className="w-6 h-6" /> Vizoraa
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1 text-gray-500 hover:text-gray-900"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-4">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium py-2 border-b border-gray-50">Home</Link>
                            {session ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium py-2 border-b border-gray-50">Dashboard</Link>
                                    <Link to="/saved" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium py-2 border-b border-gray-50">Saved Cards</Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left text-red-600 font-medium py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium py-2 border-b border-gray-50">Login</Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary justify-center mt-4">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
