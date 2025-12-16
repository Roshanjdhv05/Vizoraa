import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalCards: 0,
        totalAds: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Users (Profiles)
                const { count: userCount, error: userError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // 2. Total Cards
                const { count: cardCount, error: cardError } = await supabase
                    .from('cards')
                    .select('*', { count: 'exact', head: true });

                // 3. Total Ads
                // Note: Ads table might not exist yet if SQL hasn't been run, so handle gracefully
                let adCount = 0;
                const { count: ads, error: adError } = await supabase
                    .from('ads')
                    .select('*', { count: 'exact', head: true });
                if (!adError) adCount = ads;

                // 4. "Active Users" - approximation: Users who have created at least one card
                // access this via grouping cards by user_id.
                // However, simpler for now might be just distinct user_ids in cards table if dataset is small
                // For large datasets, this query is heavy. Let's do a distinct count on cards.user_id
                // Supabase doesn't support distinct count easily with .select(). 
                // We'll skip complex "Active User" logic for now and just show Total Users and Cards.
                // Or we can just fetch all cards (lightweight id only) and count unique users in JS if < 1000 cards.
                const { data: cardsData } = await supabase.from('cards').select('user_id');
                const uniqueActiveUsers = new Set(cardsData?.map(c => c.user_id)).size;

                setStats({
                    totalUsers: userCount || 0,
                    activeUsers: uniqueActiveUsers || 0,
                    totalCards: cardCount || 0,
                    totalAds: adCount || 0,
                });

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Creators"
                    value={stats.activeUsers}
                    icon={Activity}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Cards"
                    value={stats.totalCards}
                    icon={CreditCard}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Ads"
                    value={stats.totalAds}
                    icon={TrendingUp}
                    color="bg-orange-500"
                />
            </div>

            {/* Recent Activity or detailed charts could go here later */}
            <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-100 min-h-[300px] flex items-center justify-center text-slate-400">
                <p>Analytics charts coming soon...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
