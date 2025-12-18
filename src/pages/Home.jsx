import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, ArrowLeft, Star, X } from 'lucide-react';
import { addRating } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

import CardItem from '../components/UI/CardItem';
import AdvancedSearchFilter from '../components/UI/AdvancedSearchFilter';
import StarRating from '../components/UI/StarRating';
import AdCard from '../components/UI/AdCard';

// Templates
import ModernCard from '../components/Templates/ModernCard';
import ConferenceGradientCard from '../components/Templates/ConferenceGradientCard';
import MinimalistCard from '../components/Templates/MinimalistCard';

import GlassmorphismCard from '../components/Templates/GlassmorphismCard';
import RedGeometricCard from '../components/Templates/RedGeometricCard';
import HeroCoverProfileCard from '../components/Templates/HeroCoverProfileCard';

const Home = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [occupations, setOccupations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Updated State Structure for Multi-Select
    const [filters, setFilters] = useState({
        search: '',
        occupation: [], // Array
        area: '',
        state: [], // Array
        country: [], // Array
        sort: 'newest'
    });

    // User Interaction State
    const [user, setUser] = useState(null);
    const [likedCards, setLikedCards] = useState(new Set());
    const [savedCards, setSavedCards] = useState(new Set());

    // Modal State
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        checkUser();
        fetchOccupations();
    }, []);

    // Initial Fetch on mount only? 
    // User requested "Search button" but "Sorting updates results live".
    // I'll make useEffect trigger on sort change, but maybe not on every keystroke of filters unless button clicked.
    // However, to keep it snappy and consistent with "React" reactive patterns, 
    // often we just trigger on filters change with debounce.
    // Given the component has a dedicated Search button, I'll pass a specific handler 'onSearch' for the button.
    // BUT 'sort' should trigger immediately.

    useEffect(() => {
        // Trigger fetch on Sort change immediately
        fetchCards();
    }, [filters.sort]);

    // For other filters, we wait for explicit "Search" button click OR we can auto-fetch.
    // The user explicitly asked for a "Search" button. 
    // I will Fetch on Mount, then Fetch on Search Click, then Fetch on Sort Change.
    // But if I only put filters.sort in dependency, Search button needs to call fetchCards too.

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
        if (user) {
            fetchUserInteractions(user.id);
        }
    };

    const fetchUserInteractions = async (userId) => {
        const { data: likes } = await supabase.from('card_likes').select('card_id').eq('user_id', userId);
        const { data: saves } = await supabase.from('saved_cards').select('card_id').eq('user_id', userId);

        if (likes) setLikedCards(new Set(likes.map(l => l.card_id)));
        if (saves) setSavedCards(new Set(saves.map(s => s.card_id)));
    };

    const fetchCards = async () => {
        setLoading(true);
        try {
            // Join profiles to get is_verified AND subscription info
            let query = supabase.from('cards').select('*, card_likes(count), profiles(is_verified, subscription_plan, subscription_expiry)');

            // 1. Global Search
            if (filters.search) {
                const term = `%${filters.search}%`;
                query = query.or(`name.ilike.${term},profession.ilike.${term},location.ilike.${term}`);
            }

            // 2. Occupation
            if (filters.occupation.length > 0) {
                const orClause = filters.occupation.map(job => `profession.ilike.%${job}%`).join(',');
                query = query.or(orClause);
            }

            // 3. Area
            if (filters.area) {
                query = query.ilike('location', `%${filters.area}%`);
            }

            // 4. State
            if (filters.state.length > 0) {
                const orClause = filters.state.map(s => `location.ilike.%${s}%`).join(',');
                query = query.or(orClause);
            }

            // 5. Country
            if (filters.country.length > 0) {
                const orClause = filters.country.map(c => `location.ilike.%${c}%`).join(',');
                query = query.or(orClause);
            }

            // 6. Sorting
            if (filters.sort === 'newest') query = query.order('created_at', { ascending: false });
            else if (filters.sort === 'views') query = query.order('view_count', { ascending: false });

            const { data: cardsData, error: cardsError } = await query;
            if (cardsError) throw cardsError;

            // --- BOOST LOGIC ---
            // Sort cards: Active Gold Subscription first, then by the selected sort
            let sortedCards = cardsData || [];

            sortedCards.sort((a, b) => {
                // Check if A is Gold
                const isAGold = a.profiles?.subscription_plan === 'gold' && new Date(a.profiles?.subscription_expiry) > new Date();
                // Check if B is Gold
                const isBGold = b.profiles?.subscription_plan === 'gold' && new Date(b.profiles?.subscription_expiry) > new Date();

                if (isAGold && !isBGold) return -1; // A comes first
                if (!isAGold && isBGold) return 1;  // B comes first
                return 0; // Maintain original sort (created_at or views)
            });

            // Fetch Ratings
            let finalCards = cardsData || [];
            if (finalCards.length > 0) {
                const cardIds = finalCards.map(c => c.id);
                const { data: ratingsData } = await supabase
                    .from('card_ratings')
                    .select('card_id, rating')
                    .in('card_id', cardIds);

                const ratingsMap = {};
                ratingsData?.forEach(r => {
                    if (!ratingsMap[r.card_id]) ratingsMap[r.card_id] = { count: 0, sum: 0 };
                    ratingsMap[r.card_id].count++;
                    ratingsMap[r.card_id].sum += r.rating;
                });

                finalCards = finalCards.map(card => {
                    const r = ratingsMap[card.id] || { count: 0, sum: 0 };
                    const avg = r.count > 0 ? (r.sum / r.count).toFixed(1) : 0;
                    return {
                        ...card,
                        like_count: card.card_likes ? card.card_likes[0]?.count || 0 : 0,
                        rating_avg: parseFloat(avg),
                        rating_count: r.count
                    };
                });
            }

            // Client Side Sorts
            if (filters.sort === 'likes') {
                finalCards.sort((a, b) => b.like_count - a.like_count);
            } else if (filters.sort === 'rating') {
                finalCards.sort((a, b) => b.rating_avg - a.rating_avg);
            }

            // --- ADS INJECTION (Enhanced Logic) ---
            // Fetch active ads
            const { data: adsData } = await supabase.from('ads').select('*').eq('active', true);

            let mixedContent = [];
            if (adsData && adsData.length > 0) {
                // Separate Important and Regular Ads
                const importantAds = adsData.filter(ad => ad.is_important && ad.repeat_interval > 0);
                const regularAds = adsData.filter(ad => !ad.is_important || !ad.repeat_interval);

                // Sorting/Rotation logic
                // We'll rotate regular ads in order
                let regularAdIndex = 0;

                // Track total ad slots filled to calculate intervals
                let adSlotCount = 0;

                let cardCounter = 0;
                const INJECTION_INTERVAL = 15; // User requested 15

                finalCards.forEach((card) => {
                    mixedContent.push(card);
                    cardCounter++;

                    // Inject ad every N cards
                    if (cardCounter % INJECTION_INTERVAL === 0) {
                        adSlotCount++; // This is the Nth ad slot (1, 2, 3...)

                        let adToInject = null;

                        // Check if any Important Ad should trigger on this slot
                        // If interval is 2, it should trigger on 2, 4, 6...
                        const importantAd = importantAds.find(ad => adSlotCount % ad.repeat_interval === 0);

                        if (importantAd) {
                            adToInject = importantAd;
                        } else if (regularAds.length > 0) {
                            // Cycle through regular ads
                            adToInject = regularAds[regularAdIndex % regularAds.length];
                            regularAdIndex++;
                        } else if (importantAds.length > 0) {
                            // Fallback if no regular ads but we have important ones not triggering: 
                            // Maybe just cycle important ones or skip? 
                            // User requirement implies "regular" rotation unless "important" overrides.
                            // If ONLY important ads exist, we might want to show them? 
                            // For now, adhere strictly: Important only on interval. 
                            // If no regular ads, maybe show nothing or just cycle any ad? 
                            // Let's cycle any important ad as fallback to ensure *an* ad shows if possible?
                            // No, adhere to specific logic.
                        }

                        if (adToInject) {
                            mixedContent.push({ ...adToInject, type: 'ad' });
                        }
                    }
                });
            } else {
                mixedContent = finalCards;
            }

            setCards(mixedContent);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (e, cardId) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        const isLiked = likedCards.has(cardId);
        const newLikes = new Set(likedCards);
        if (isLiked) newLikes.delete(cardId);
        else newLikes.add(cardId);
        setLikedCards(newLikes);

        setCards(prev => prev.map(c => {
            if (c.id === cardId) {
                return { ...c, like_count: isLiked ? Math.max(0, c.like_count - 1) : c.like_count + 1 };
            }
            return c;
        }));

        if (isLiked) {
            await supabase.from('card_likes').delete().eq('user_id', user.id).eq('card_id', cardId);
        } else {
            await supabase.from('card_likes').insert({ user_id: user.id, card_id: cardId });
        }
    };

    const handleSave = async (e, cardId) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        const isSaved = savedCards.has(cardId);
        const newSaved = new Set(savedCards);
        if (isSaved) newSaved.delete(cardId);
        else newSaved.add(cardId);
        setSavedCards(newSaved);

        if (isSaved) {
            await supabase.from('saved_cards').delete().eq('user_id', user.id).eq('card_id', cardId);
        } else {
            await supabase.from('saved_cards').insert({ user_id: user.id, card_id: cardId });
        }
    };

    const openCard = async (card) => {
        let userRating = 0;
        if (user) {
            const { data } = await supabase.from('card_ratings')
                .select('rating')
                .eq('card_id', card.id)
                .eq('user_id', user.id)
                .maybeSingle();
            if (data) userRating = data.rating;
        }

        setSelectedCard({ ...card, user_rating: userRating });

        try {
            await supabase.from('cards').update({ view_count: (card.view_count || 0) + 1 }).eq('id', card.id);
            setCards(prev => prev.map(c => {
                if (c.id === card.id) {
                    return { ...c, view_count: (c.view_count || 0) + 1 };
                }
                return c;
            }));
        } catch (error) {
            console.error('Error updating view count:', error);
        }
    };

    const renderSelectedCard = () => {
        if (!selectedCard) return null;
        const isLiked = likedCards.has(selectedCard.id);
        const isSaved = savedCards.has(selectedCard.id);
        const props = {
            card: selectedCard,
            isSaved,
            isLiked,
            userRating: 0,
            ratingStats: { average: selectedCard.rating_avg || 0, count: selectedCard.rating_count || 0 },
            handleLike: (e) => handleLike(e, selectedCard.id),
            handleSave: (e) => handleSave(e, selectedCard.id),
            showRating: true,
            isVerified: selectedCard.profiles?.is_verified,
            handleRate: async (rating) => {
                if (!user) return navigate('/login');
                const { error } = await addRating(selectedCard.id, user.id, rating);
                if (!error) {
                    setSelectedCard(prev => ({ ...prev, user_rating: rating }));
                    fetchCards();
                }
            }
        };

        switch (selectedCard.template_id) {
            case 'conference-gradient': return <ConferenceGradientCard {...props} />;
            case 'minimalist': return <MinimalistCard {...props} />;
            case 'glassmorphism': return <GlassmorphismCard {...props} />;
            case 'red-geometric': return <RedGeometricCard {...props} />;
            case 'hero-cover-profile': return <HeroCoverProfileCard {...props} />;
            case 'modern': default: return <ModernCard {...props} />;
        }
    };

    return (
        <div className="p-4 md:p-8 pb-20 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="mb-10 text-center xl:text-left">
                <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Discover Amazing Digital Cards</h1>
                <p className="text-[#94a3b8] text-lg">Connect with professionals worldwide</p>
            </div>

            {/* Advanced Filters */}
            <div className="mb-12 sticky top-4 z-40">
                <AdvancedSearchFilter
                    filters={filters}
                    setFilters={setFilters}
                    onSearch={fetchCards}
                    occupations={occupations}
                />
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="flex justify-center py-40"><Loader2 className="animate-spin w-10 h-10 text-[#7B4BFF]" /></div>
            ) : cards.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 text-center border border-gray-100 shadow-sm">
                    <p className="text-xl text-slate-400 font-medium mb-4">No cards found matching your criteria.</p>
                    <button onClick={() => {
                        setFilters({ search: '', occupation: [], area: '', state: [], country: [], sort: 'newest' });
                        setTimeout(() => fetchCards(), 100);
                    }} className="text-[#7B4BFF] font-bold hover:underline">Clear all filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {(() => {
                        // Interleave Ads logic
                        // Need separate ad list or if I mixed them in 'cards' state?
                        // 'cards' state currently holds just card objects. 
                        // I will mix them right here during render for simplicity if I have the ads list in state.
                        // But I haven't added ads to state yet.
                        // Let's modify fetchCards to mix them into 'cards' state or add a new 'ads' state.
                        // I will assume I updated fetchCards to mix them or store ads separately.
                        // Let's rely on 'mixedItems' which I will compute in the body if I had separate states.
                        // Or better, let 'cards' state hold mixed items.
                        // Update: Since I am replacing the Grid section, I will assume 'cards' state now holds mixed items.
                        // I will handle the logic in the fetchCards update below.

                        return cards.map((item, index) => {
                            if (item.type === 'ad') {
                                return <AdCard key={`ad-${item.id}-${index}`} ad={item} />;
                            }

                            // It is a card
                            const card = item;
                            return (
                                <CardItem
                                    key={card.id}
                                    card={card}
                                    isLiked={likedCards.has(card.id)}
                                    isSaved={savedCards.has(card.id)}
                                    // Pass isVerified from the join
                                    isVerified={card.profiles?.is_verified}
                                    ratingAvg={card.rating_avg}
                                    ratingCount={card.rating_count}
                                    onLike={(e) => handleLike(e, card.id)}
                                    onSave={(e) => handleSave(e, card.id)}
                                    onView={openCard}
                                />
                            );
                        });
                    })()}
                </div>
            )}

            {/* Modal */}
            {selectedCard && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCard(null)}></div>
                    <div className="relative z-10 w-full max-w-5xl h-[85vh] md:h-[90vh] bg-slate-100 rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeInUp">
                        <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 md:top-6 md:left-6 md:right-auto z-50 p-2 md:p-3 bg-white/80 hover:bg-white backdrop-blur rounded-full transition-all shadow-lg text-slate-800">
                            {/* Mobile: Close X, Desktop: Back Arrow */}
                            <div className="md:hidden"><X className="w-5 h-5" /></div>
                            <div className="hidden md:block"><ArrowLeft className="w-5 h-5" /></div>
                        </button>

                        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center py-12 gap-8 custom-scrollbar">
                            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl px-4">
                                {renderSelectedCard()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
