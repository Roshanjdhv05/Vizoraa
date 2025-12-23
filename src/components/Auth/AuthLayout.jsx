import React from 'react';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                            <img src="/logo.png" alt="Vizoraa Logo" className="w-12 h-12 object-contain" />
                            <span>Vizoraa</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                        {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
                    </div>

                    {children}
                </div>
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center text-sm text-slate-500">
                    Protected by Vizoraa Security
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
