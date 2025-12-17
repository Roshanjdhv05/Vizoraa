import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
    Plus, Layout, Heart, Eye, Star, CreditCard,
    Edit2, Trash2, MoreVertical, Globe, Lock, Share2, QrCode, Crown
} from 'lucide-react';
import QRCodeModal from '../components/UI/QRCodeModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, likes: 0, views: 0, avgRating: 0 });
    const [showDeleteModal, setShowDeleteModal] = useState(null); // cardId or null
    const [showQRModal, setShowQRModal] = useState(null); // card object or null
    const [subscription, setSubscription] = useState(null); // { plan, expiry }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Profile for Subscription
        const { data: profile } = await supabase.from('profiles').select('subscription_plan, subscription_expiry').eq('id', user.id).single();
        if (profile) {
            setSubscription({
                plan: profile.subscription_plan,
                expiry: profile.subscription_expiry
            });
        }

        // Fetch user's cards with rating info if available (using previously added columns)
        const { data: userCards, error } = await supabase
            .from('cards')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setCards(userCards || []);

        // Calculate stats
        const total = userCards?.length || 0;
        const views = userCards?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;
        const likes = userCards?.reduce((acc, curr) => acc + (curr.like_count || 0), 0) || 0;

        // Calculate avg rating across all cards
        let totalRatingSum = 0;
        let totalRatingCount = 0;
        userCards?.forEach(c => {
            if (c.rating_avg) {
                totalRatingSum += (c.rating_avg * (c.rating_count || 1));
                totalRatingCount += (c.rating_count || 0);
            }
        });
        const avgRating = totalRatingCount > 0 ? (totalRatingSum / totalRatingCount).toFixed(1) : 0;

        setStats({ total, views, likes, avgRating });
        setLoading(false);
    };

    const handleTogglePublic = async (cardId, currentStatus) => {
        const newStatus = !currentStatus;

        // Optimistic Update
        setCards(prev => prev.map(c =>
            c.id === cardId ? { ...c, is_public: newStatus } : c
        ));

        const { error } = await supabase
            .from('cards')
            .update({ is_public: newStatus })
            .eq('id', cardId);

        if (error) {
            console.error('Error updating visibility:', error);
            // Revert on error
            setCards(prev => prev.map(c =>
                c.id === cardId ? { ...c, is_public: currentStatus } : c
            ));
        }
    };

    const handleDelete = async () => {
        if (!showDeleteModal) return;
        const cardId = showDeleteModal;

        // Delete from Supabase
        const { error } = await supabase
            .from('cards')
            .delete()
            .eq('id', cardId);

        if (error) {
            console.error('Error deleting card:', error);
            alert('Failed to delete card');
            return;
        }

        // Successfully deleted
        setCards(prev => prev.filter(c => c.id !== cardId));
        setShowDeleteModal(null);

        // Update stats locally or refetch
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
    };

    const StatCard = ({ label, value, icon: Icon, color, shadowColor }) => (
        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-5 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-default group">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center ${color} shadow-lg ${shadowColor} group-hover:rotate-6 transition-transform`}>
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight group-hover:text-[#7B4BFF] transition-colors">{value}</h3>
                <p className="text-slate-400 font-medium text-xs md:text-sm uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );

    const DashboardCardRow = ({ card }) => (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all group">
            {/* Thumbnail */}
            <div className="w-full md:w-24 h-32 md:h-24 rounded-xl bg-slate-100 flex-shrink-0 relative overflow-hidden">
                {card.avatar_url ? (
                    <img src={card.avatar_url} alt={card.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Layout className="w-8 h-8" />
                    </div>
                )}
                {/* Mobile Status Badge */}
                <div className="absolute top-2 right-2 md:hidden">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border ${card.is_public !== false ? 'bg-emerald-500/20 text-emerald-700 border-emerald-200' : 'bg-amber-500/20 text-amber-700 border-amber-200'}`}>
                        {card.is_public !== false ? 'Public' : 'Private'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{card.name || 'Untitled Card'}</h3>
                <p className="text-slate-500 text-sm mb-3">{card.profession || 'No title'}</p>

                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {card.view_count || 0} Views
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {card.like_count || 0} Likes
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {card.rating_avg || 0} ({card.rating_count || 0})
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">

                {/* Toggle Visibility */}
                <button
                    onClick={() => handleTogglePublic(card.id, card.is_public !== false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-full md:w-auto justify-center ${card.is_public !== false
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                >
                    {card.is_public !== false ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {card.is_public !== false ? 'Public' : 'Private'}
                </button>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link
                        to={`/edit-card/${card.id}`}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-[#7B4BFF] hover:border-purple-200 transition-all"
                        title="Edit Card"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="md:hidden text-sm font-medium">Edit</span>
                    </Link>

                    <button
                        onClick={() => setShowQRModal(card)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all"
                        title="View QR Code"
                    >
                        <QrCode className="w-4 h-4" />
                        <span className="md:hidden text-sm font-medium">QR</span>
                    </button>

                    <button
                        onClick={() => setShowDeleteModal(card.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                        title="Delete Card"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="md:hidden text-sm font-medium">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 pb-24 max-w-[1600px] mx-auto animate-fadeIn min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Your Dashboard</h1>
                    <p className="text-slate-400 mt-2 text-base md:text-lg">Manage and analyze your portfolio</p>
                </div>

                <Link to="/create-card" className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#7B4BFF] to-[#A07BFF] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-purple-200 hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                    <Plus className="w-5 h-5" />
                    Create New Card
                </Link>
            </div>

            {/* Subscription Status Banner */}
            {(() => {
                const checkSubscription = () => {
                    // We need to fetch this from profile, but we can do a quick check if we store it in session metadata 
                    // or fetch it separately. Ideally fetchDashboardData should return profile info too.
                    // As a quick patch, let's assume fetchDashboardData (which runs on mount) updates user state if we add it.
                    // BUT for now, let's add a separate fetch for profile subscription status inside fetchDashboardData or here.
                    return null;
                };
                // Implementation Note: Since I can't easily change the hook state structure without bigger refactor,
                // I will add a small inline logic here using a new state "subscription" if I added it above.
                // Let's Add "subscription" state to Dashboard component first.
            })()}

            {subscription && subscription.plan === 'gold' && new Date(subscription.expiry) < new Date() && (
                <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3 text-red-700">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Premium Plan Expired</h3>
                            <p className="text-sm opacity-90">Your Gold benefits have ended. Renew now to restore premium features.</p>
                        </div>
                    </div>
                    <Link to="/premium" className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                        Renew Gold
                    </Link>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                <StatCard label="Total Cards" value={stats.total} icon={CreditCard} color="bg-gradient-to-br from-blue-500 to-blue-600" shadowColor="shadow-blue-200" />
                <StatCard label="Total Likes" value={stats.likes} icon={Heart} color="bg-gradient-to-br from-pink-500 to-pink-600" shadowColor="shadow-pink-200" />
                <StatCard label="Total Views" value={stats.views} icon={Eye} color="bg-gradient-to-br from-emerald-500 to-emerald-600" shadowColor="shadow-emerald-200" />
                <StatCard label="Avg Rating" value={stats.avgRating} icon={Star} color="bg-gradient-to-br from-amber-400 to-amber-500" shadowColor="shadow-amber-200" />
            </div>

            {/* Cards List */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    My Cards <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{cards.length}</span>
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#7B4BFF] border-t-transparent rounded-full animate-spin"></div></div>
                ) : cards.length === 0 ? (
                    <div className="bg-white rounded-[32px] md:rounded-[40px] p-10 md:p-20 flex flex-col items-center justify-center text-center border border-gray-100 shadow-sm mx-auto max-w-2xl">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 animate-bounce">
                            <Layout className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">No cards yet</h2>
                        <p className="text-slate-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">Create your first digital visiting card today and start sharing it with the world.</p>
                        <Link to="/create-card" className="text-[#7B4BFF] font-bold hover:underline text-lg">Create First Card</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cards.map(card => (
                            <DashboardCardRow key={card.id} card={card} />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-fadeInUp">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Delete Card?</h3>
                        <p className="text-slate-500 text-center text-sm mb-8">
                            Are you sure you want to delete this card? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && (
                <QRCodeModal
                    card={showQRModal}
                    onClose={() => setShowQRModal(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
