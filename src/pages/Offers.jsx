import React, { useState, useEffect } from 'react';
import { Plus, Flame, Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OfferCard from '../components/UI/OfferCard';
import CreateOfferModal from '../components/UI/CreateOfferModal';
import AdvancedSearchFilter from '../components/UI/AdvancedSearchFilter'; // Reusing filter styling if needed or just simple header

const Offers = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filteredUserId = searchParams.get('user_id');

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Search/Filter state
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        checkUser();
        fetchOffers();
    }, [filteredUserId]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchOffers = async () => {
        setLoading(true);
        try {
            // Need to join with user details. 
            // Since we don't have a direct relation set up in Supabase client type (maybe),
            // we will fetch offers and then map user data or use a joined query if 'profiles' or 'cards' are linked.
            // Let's assume we can join with 'cards' table on user_id to get avatar/name or 'profiles' table.

            // However, Supabase joins work best if foreign keys are explicit. 
            // 'offers.user_id' -> 'auth.users.id'. 
            // We usually store user profile info in 'public.profiles' or 'public.cards'.
            // Let's rely on 'cards' to get the display info (name/avatar) since that's what we show.
            // We'll fetch offers first.

            let query = supabase
                .from('offers')
                .select(`
                    *,
                    offer_likes (user_id)
                `)
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            // Filter by specific user if param exists
            if (filteredUserId) {
                query = query.eq('user_id', filteredUserId);
            }

            const { data: offersData, error } = await query;
            if (error) throw error;

            // Enrich with user data from 'cards' table (as a proxy for user profile)
            // We get the *primary* card for each user.
            const userIds = [...new Set(offersData.map(o => o.user_id))];

            if (userIds.length > 0) {
                const { data: cardsData } = await supabase
                    .from('cards')
                    .select('id, user_id, name, avatar_url, profession') // Added profession for context if needed
                    .in('user_id', userIds);

                // Map card info to offers
                const enrichedOffers = offersData.map(offer => {
                    // Try to find specific card if selected, otherwise fallback to first user card
                    const userCard = offer.card_id
                        ? cardsData?.find(c => c.id === offer.card_id)
                        : cardsData?.find(c => c.user_id === offer.user_id);

                    // Check if current user liked this
                    const { data: { user: currentUser } } = { data: { user } } || { data: { user: null } };
                    const isLiked = offer.offer_likes?.some(like => like.user_id === user?.id) || false;
                    const likeCount = offer.offer_likes?.length || 0;

                    return {
                        ...offer,
                        user_name: userCard?.name || 'Unknown User',
                        user_avatar: userCard?.avatar_url,
                        profession: userCard?.profession,
                        cards: userCard ? [userCard] : [], // Pass cards array for navigation
                        is_liked_by_user: isLiked,
                        like_count: likeCount
                    };
                });

                setOffers(enrichedOffers);
            } else {
                setOffers(offersData);
            }

        } catch (error) {
            console.error('Error fetching offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            setShowCreateModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="container max-w-5xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                                {filteredUserId ? 'User Offers' : 'Exclusive Offers'}
                            </h1>
                            <p className="text-slate-500 text-sm">
                                {filteredUserId
                                    ? 'Viewing offers from selected profile'
                                    : 'Discover latest deals from professionals'
                                }
                                {filteredUserId && (
                                    <button
                                        onClick={() => navigate('/offers')}
                                        className="ml-2 text-indigo-600 underline font-semibold"
                                    >
                                        View All
                                    </button>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search offers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchOffers()}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            </div>

                            {/* Post Button */}
                            <button
                                onClick={handleCreateClick}
                                className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-slate-200"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Post Offer</span>
                                <span className="sm:hidden">Post</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="container max-w-5xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Flame className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No active offers yet</h3>
                        <p className="text-slate-500 mb-6">Be the first to post a deal for the community!</p>
                        <button
                            onClick={handleCreateClick}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Post an Offer Now
                        </button>
                    </div>
                ) : (
                    <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map(offer => (
                            <OfferCard
                                key={offer.id}
                                offer={offer}
                                currentUserId={user?.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showCreateModal && (
                <CreateOfferModal
                    userId={user.id}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        fetchOffers(); // Refresh feed
                    }}
                />
            )}
        </div>
    );
};

export default Offers;
