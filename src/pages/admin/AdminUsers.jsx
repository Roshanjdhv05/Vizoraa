import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Trash2, CheckCircle, XCircle, Info, BadgeCheck } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch profiles and count their cards
            const { data, error } = await supabase
                .from('profiles')
                .select('*, cards(count)');

            if (error) throw error;

            // Format data
            const formatted = data.map(profile => ({
                id: profile.id,
                email: profile.email,
                name: profile.full_name || 'No Name',
                cardsCount: profile.cards?.[0]?.count || 0, // 'cards' comes back as [{count: N}]
                isVerified: profile.is_verified,
                avatar: profile.avatar_url
            }));

            setUsers(formatted);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            const { error } = await supabase.rpc('toggle_user_verification', { target_user_id: userId });
            if (error) throw error;

            // Optimistic update
            setUsers(users.map(u =>
                u.id === userId ? { ...u, isVerified: !u.isVerified } : u
            ));
        } catch (error) {
            console.error('Error verifying user:', error);
            alert('Failed to update verification status. Make sure SQL functions are run.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you definitely sure? This will delete the user and ALL their cards permanently.')) return;

        try {
            const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
            if (error) throw error;

            // Remove from list
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Make sure SQL functions are run.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm">Manage user accounts and verification</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cards</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No users found</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                                                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                                                        {user.name}
                                                        {user.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-current text-white" />}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                                                {user.cardsCount} cards
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleVerifyUser(user.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${user.isVerified
                                                    ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {user.isVerified ? (
                                                    <>Verified <CheckCircle className="w-3.5 h-3.5" /></>
                                                ) : (
                                                    <>Unverified</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all tooltip"
                                                title="Delete User & Cards"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
