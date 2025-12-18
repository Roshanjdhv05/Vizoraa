import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Check, Star, Shield, Zap, Crown, Loader2 } from 'lucide-react';

const Premium = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('6_months'); // Default to best value

    const plans = [
        {
            id: '1_month',
            name: 'Monthly Gold',
            duration: '1 Month',
            price: 69,
            originalPrice: 199,
            features: ['Boost your profile', 'Priority Support'],
            color: 'bg-white',
            border: 'border-slate-200',
            button: 'bg-slate-900 text-white hover:bg-black',
        },
        {
            id: '6_months',
            name: 'Half-Yearly Gold',
            duration: '6 Months',
            price: 269,
            originalPrice: 1194,
            features: ['Boost your profile', 'Priority Support'],
            color: 'bg-gradient-to-b from-amber-50 to-white', // Gold tint
            border: 'border-amber-400 ring-4 ring-amber-50',
            popular: true,
            button: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200',
        },
        {
            id: '12_months',
            name: 'Annual Gold',
            duration: '12 Months',
            price: 569,
            originalPrice: 2388,
            features: ['Boost your profile', 'Priority Support'],
            color: 'bg-white',
            border: 'border-slate-200',
            button: 'bg-slate-900 text-white hover:bg-black',
        },
    ];

    // Reuse Loader from CreateCard (Ideally standardise this)
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (plan) => {
        setLoading(true);
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        const razropayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razropayKey) {
            alert('Payment Configuration Error: Key not found.');
            setLoading(false);
            return;
        }

        const options = {
            key: razropayKey,
            amount: plan.price * 100, // Amount in paise
            currency: 'INR',
            name: `Vizoraa ${plan.name}`,
            description: `Subscription for ${plan.duration}`,
            image: 'https://via.placeholder.com/150', // Replace with logo
            handler: async function (response) {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('User not found');

                    // Calculate expiry
                    const now = new Date();
                    let expiryDate = new Date();

                    if (plan.id === '1_month') expiryDate.setMonth(now.getMonth() + 1);
                    if (plan.id === '6_months') expiryDate.setMonth(now.getMonth() + 6);
                    if (plan.id === '12_months') expiryDate.setFullYear(now.getFullYear() + 1);

                    // Update Profile
                    const { error } = await supabase
                        .from('profiles')
                        .update({
                            subscription_plan: 'gold',
                            subscription_expiry: expiryDate.toISOString(),
                            // Store payment ref if we had a dedicated table for transactions, 
                            // but for now relying on Razorpay dashboard
                        })
                        .eq('id', user.id);

                    if (error) throw error;

                    alert('Subscription Successful! Welcome to Gold.');
                    navigate('/dashboard');

                } catch (err) {
                    console.error(err);
                    alert('Subscription recorded failed: ' + err.message);
                } finally {
                    setLoading(false);
                }
            },
            theme: {
                color: '#f59e0b'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description}`);
            setLoading(false);
        });
        paymentObject.open();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-12">
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                    Premium Membership
                </span>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                    Upgrade to Gold <span className="text-amber-500">Plan</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Unlock the full potential of your digital identity. Get access to exclusive templates, advanced analytics, and more.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 ${plan.border}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                <Crown className="w-3 h-3 fill-current" /> MOST POPULAR
                            </div>
                        )}

                        <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">₹{plan.price}</span>
                            <span className="text-slate-400 line-through text-sm">₹{plan.originalPrice}</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan)}
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${plan.button}`}
                        >
                            {loading && selectedPlan === plan.id ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                'Get Started'
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">Secure Payment</h4>
                    <p className="text-sm text-slate-500">100% secure payment processing powered by Razorpay.</p>
                </div>
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">Instant Access</h4>
                    <p className="text-sm text-slate-500">Your premium features are unlocked immediately after payment.</p>
                </div>
                <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto">
                        <Star className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900">Cancel Anytime</h4>
                    <p className="text-sm text-slate-500">No long-term contracts. Contact support to manage subscription.</p>
                </div>
            </div>
        </div>
    );
};

export default Premium;
