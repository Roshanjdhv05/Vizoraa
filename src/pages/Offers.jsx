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
    const [filters, setFilters] = useState({
        search: '',
        occupation: [],
        category: 'All',
        area: '',
        state: [],
        country: [],
        sort: 'newest'
    });

    const [occupations, setOccupations] = useState([]);

    useEffect(() => {
        checkUser();
        fetchOccupations();
    }, []);

    // Fetch offers whenever filters change (debouncing could be added but direct call is okay for now)
    useEffect(() => {
        fetchOffers();
    }, [filters, filteredUserId]);

    const fetchOccupations = async () => {
        const { data } = await supabase.from('cards').select('profession');
        if (data) {
            const unique = [...new Set(data.map(item => item.profession).filter(Boolean))];
            setOccupations(unique);
        }
    };

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchOffers = async () => {
        setLoading(true);
        try {
            // STEP 1: RESOLVE USER FILTERS (Card/Profile based)
            // If any filter relates to the User/Card (Occupation, Location), we must find matching UserIDs first.
            let validUserIds = null;
            const hasUserFilters = filters.occupation.length > 0 || filters.area || filters.state.length > 0 || filters.country.length > 0;

            if (hasUserFilters) {
                let cardQuery = supabase.from('cards').select('user_id');

                if (filters.occupation.length > 0) {
                    const orClause = filters.occupation.map(job => `profession.ilike.%${job}%`).join(',');
                    cardQuery = cardQuery.or(orClause);
                }
                if (filters.area) {
                    cardQuery = cardQuery.ilike('location', `%${filters.area}%`);
                }
                if (filters.state.length > 0) {
                    const orClause = filters.state.map(s => `location.ilike.%${s}%`).join(',');
                    cardQuery = cardQuery.or(orClause);
                }
                if (filters.country.length > 0) {
                    const orClause = filters.country.map(c => `location.ilike.%${c}%`).join(',');
                    cardQuery = cardQuery.or(orClause);
                }

                const { data: matchingCards, error: cardError } = await cardQuery;
                if (cardError) throw cardError;

                validUserIds = matchingCards.map(c => c.user_id);

                // If filters are active but no users match, return empty result strictly
                if (validUserIds.length === 0) {
                    setOffers([]);
                    setLoading(false);
                    return;
                }
            }

            // STEP 2: FETCH OFFERS
            let query = supabase
                .from('offers')
                .select(`
                    *,
                    offer_likes (user_id)
                `);

            // Apply Search on Title
            if (filters.search) {
                query = query.ilike('title', `%${filters.search}%`);
            }

            // Apply User ID Restrictions
            if (filteredUserId) {
                // Specific profile view overrides other filters usually, but let's allow combined
                query = query.eq('user_id', filteredUserId);
            } else if (validUserIds !== null) {
                // Apply the filter result
                query = query.in('user_id', validUserIds);
            }

            // Apply Sorting
            if (filters.sort === 'newest') {
                query = query.order('created_at', { ascending: false });
            }
            // Note: 'likes' sorting usually requires client-side sort after fetch if not using an RPC or view, 
            // OR we fetch all and sort below. We'll default to DB sort for newest.

            const { data: offersData, error } = await query;
            if (error) throw error;

            // Enrich with user data from 'cards' table
            const userIds = [...new Set(offersData.map(o => o.user_id))];

            if (userIds.length > 0) {
                const { data: cardsData } = await supabase
                    .from('cards')
                    .select('id, user_id, name, avatar_url, profession')
                    .in('user_id', userIds);

                // Map card info to offers
                let enrichedOffers = offersData.map(offer => {
                    const userCard = offer.card_id
                        ? cardsData?.find(c => c.id === offer.card_id)
                        : cardsData?.find(c => c.user_id === offer.user_id);

                    const isLiked = offer.offer_likes?.some(like => like.user_id === user?.id) || false;
                    const likeCount = offer.offer_likes?.length || 0;

                    return {
                        ...offer,
                        user_name: userCard?.name || 'Unknown User',
                        user_avatar: userCard?.avatar_url,
                        profession: userCard?.profession,
                        cards: userCard ? [userCard] : [],
                        is_liked_by_user: isLiked,
                        like_count: likeCount
                    };
                });

                // Client-side Sorting (for aggregations we can't easily DB sort without Views)
                if (filters.sort === 'likes' || filters.sort === 'rating' || filters.sort === 'views') {
                    enrichedOffers.sort((a, b) => b.like_count - a.like_count);
                }

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
                    <div className="flex flex-col gap-6">
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

                            {/* Post Button */}
                            <button
                                onClick={handleCreateClick}
                                className="bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-slate-200 self-start md:self-auto"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Post Offer</span>
                                <span className="sm:hidden">Post</span>
                            </button>
                        </div>

                        {/* Reused Search Component */}
                        <div className="-mx-4 md:mx-0">
                            <AdvancedSearchFilter
                                filters={filters}
                                setFilters={setFilters}
                                onSearch={fetchOffers}
                                occupations={occupations}
                                placeholder="Search offers..."
                            />
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
