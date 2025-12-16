import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import AuthLayout from './AuthLayout';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="We have sent a password reset link to your email."
            >
                <div className="flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-xl border border-green-100 mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                    <p className="text-slate-600 mb-2">
                        We sent a password reset link to:
                    </p>
                    <p className="font-semibold text-slate-800">{email}</p>
                </div>

                <Link
                    to="/login"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center"
                >
                    Back to Login
                </Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive a reset link"
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Email'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
