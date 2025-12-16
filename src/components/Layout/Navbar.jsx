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

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 flex flex-col gap-4">
                    <Link to="/" className="text-gray-600 font-medium">Home</Link>
                    {session ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 font-medium">Dashboard</Link>
                            <Link to="/saved" className="text-gray-600 font-medium">Saved Cards</Link>
                            <button onClick={handleLogout} className="text-left text-red-600 font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 font-medium">Login</Link>
                            <Link to="/signup" className="text-indigo-600 font-medium">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
