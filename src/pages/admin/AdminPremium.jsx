import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Loader2, Crown, ShieldCheck, Check, Clock, CreditCard, LayoutTemplate } from 'lucide-react';

const AdminPremium = () => {
    const [users, setUsers] = useState([]);
    const [premiumUsers, setPremiumUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Granting State
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCards, setUserCards] = useState([]);
    const [duration, setDuration] = useState(6);
    const [granting, setGranting] = useState(false);

    useEffect(() => {
        if (selectedUser) {
            fetchUserCards(selectedUser.id);
        } else {
            setUserCards([]);
        }
    }, [selectedUser]);

    const fetchUserCards = async (userId) => {
        const { data } = await supabase.from('cards').select('*').eq('user_id', userId);
        if (data) setUserCards(data);
    };

    const handleGrantCardPremium = async (card) => {
        if (!window.confirm(`Are you sure you want to upgrade "${card.name}" to Premium for free?`)) return;

        try {
            const { error } = await supabase.rpc('grant_card_premium', {
                target_card_id: card.id
            });

            if (error) throw error;

            alert(`Successfully upgraded card "${card.name}" to Premium!`);
            fetchUserCards(selectedUser.id); // Refresh list
        } catch (error) {
            console.error('Error upgrading card:', error);
            alert('Failed to upgrade card: ' + error.message);
        }
    };

    // Template Unlocking
    const unlockableTemplates = [
        { id: 'hero-cover-profile', name: 'Hero Cover' }
    ];

    const handleUnlockTemplate = async (templateId) => {
        if (!selectedUser) return;
        try {
            const { error } = await supabase.rpc('grant_template_access', {
                target_user_id: selectedUser.id,
                template_id: templateId
            });

            if (error) throw error;
            alert('Template unlocked successfully!');
            fetchData();
        } catch (error) {
            console.error('Error unlocking template:', error);
            alert('Error unlocking template: ' + error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch all profiles for search
        const { data: allProfiles } = await supabase.from('profiles').select('*');
        if (allProfiles) setUsers(allProfiles);

        // Filter Premium Users
        const premium = allProfiles?.filter(p =>
            p.subscription_plan === 'gold' &&
            new Date(p.subscription_expiry) > new Date()
        ) || [];
        setPremiumUsers(premium);

        setLoading(false);
    };

    const handleGrantPremium = async () => {
        if (!selectedUser) return;
        setGranting(true);

        try {
            // Call the database function we created
            const { error } = await supabase.rpc('grant_premium_access', {
                target_user_id: selectedUser.id,
                duration_months: parseInt(duration)
            });

            if (error) throw error;

            alert(`Successfully granted ${duration} months Gold Plan to ${selectedUser.full_name || selectedUser.email}`);
            setSelectedUser(null);
            fetchData(); // Refresh lists

        } catch (error) {
            console.error('Error granting premium:', error);
            alert('Failed to grant premium: ' + error.message);
        } finally {
            setGranting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase())) &&
        // Exclude already active premium from search results to avoid confusion? 
        // Or keep them to allow extending? Let's keep them.
        true
    ).slice(0, 5); // Limit suggestions

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Premium Management</h1>
                <p className="text-slate-500">Manage Gold subscriptions and free grants</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Grant Premium Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                            <Crown className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Grant Free Access</h2>
                    </div>

                    {/* User Search */}
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select User</label>
                        {selectedUser ? (
                            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold">
                                        {selectedUser.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">{selectedUser.full_name}</p>
                                        <p className="text-xs text-slate-500">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-red-500">
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {search && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                                        {filteredUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => { setSelectedUser(user); setSearch(''); }}
                                                className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-slate-800">{user.full_name || 'No Name'}</p>
                                                    <p className="text-xs text-slate-400">{user.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Duration</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 6, 12].map(m => (
                                <button
                                    key={m}
                                    onClick={() => setDuration(m)}
                                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${duration === m
                                        ? 'bg-amber-500 text-white border-amber-500 shadow-md transform scale-105'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
                                        }`}
                                >
                                    {m} Month{m > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGrantPremium}
                        disabled={!selectedUser || granting}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {granting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        Grant Gold Access
                    </button>

                    {/* User Cards Section */}
                    {selectedUser && (
                        <div className="mt-8 border-t border-slate-100 pt-6 animate-fadeIn">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-slate-400" />
                                User Cards ({userCards.length})
                            </h3>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {userCards.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">User has no cards.</p>
                                ) : (
                                    userCards.map(card => (
                                        <div key={card.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{card.name}</p>
                                                <p className="text-xs text-slate-500">{card.profession || 'No profession'}</p>
                                            </div>

                                            {card.is_premium ? (
                                                <span className="px-2 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold flex items-center gap-1">
                                                    <Crown className="w-3 h-3 fill-current" /> Premium
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleGrantCardPremium(card)}
                                                    className="px-3 py-1.5 bg-white text-slate-900 border border-slate-200 rounded-lg text-xs font-bold hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm"
                                                >
                                                    Upgrade
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Unlock Templates Section */}
                    {selectedUser && (
                        <div className="mt-8 border-t border-slate-100 pt-6 animate-fadeIn">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                                Unlock Templates
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {unlockableTemplates.map(template => {
                                    const isUnlocked = selectedUser.unlocked_templates?.includes(template.id);
                                    return (
                                        <div key={template.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                            <span className="font-bold text-slate-700 text-sm">{template.name}</span>
                                            {isUnlocked ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Unlocked
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnlockTemplate(template.id)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                                                >
                                                    Unlock
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Active Premium Users List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Active Premium Users</h2>
                        <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs">
                            {premiumUsers.length} Users
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {premiumUsers.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <Crown className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No active premium subscriptions</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {premiumUsers.map(user => (
                                    <div key={user.id} className="p-3 rounded-xl border border-slate-100 hover:border-amber-200 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold shadow-inner">
                                                {user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900 text-sm">{user.full_name || 'User'}</p>
                                                    <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                </div>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                                                <Clock className="w-3 h-3" />
                                                Exp: {new Date(user.subscription_expiry).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPremium;
