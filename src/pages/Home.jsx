import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, ArrowLeft, Star, X, Flame } from 'lucide-react';
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
import ProfessionalDevCard from '../components/Templates/ProfessionalDevCard';
import CircularModernCard from '../components/Templates/CircularModernCard';
import FlipCard from '../components/Templates/FlipCard';

const Home = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [occupations, setOccupations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Updated State Structure for Multi-Select
    const [filters, setFilters] = useState({
        search: '',
        occupation: [], // Array
        category: 'All', // 'All', 'Personal', 'Business', 'Freelancer'
        area: '',
        state: [], // Array
        country: [], // Array
        sort: 'newest'
    });

    // User Interaction State
    const [user, setUser] = useState(null);
    const [likedCards, setLikedCards] = useState(new Set());
    const [savedCards, setSavedCards] = useState(new Set());

    // Inline Expansion State
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [expandedCardData, setExpandedCardData] = useState(null); // Store the full card object for the view
    const [expandedPosition, setExpandedPosition] = useState({ top: 0, left: 0, width: 320, placement: 'bottom' });
    const cardRefs = React.useRef({});
    const mainContainerRef = React.useRef(null);

    useEffect(() => {
        checkUser();
        fetchOccupations();
    }, []);

    useEffect(() => {
        // Trigger fetch on Sort or Category change immediately
        fetchCards();
    }, [filters.sort, filters.category]);

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

            // 2.5 Category Filter
            if (filters.category && filters.category !== 'All') {
                query = query.eq('category', filters.category);
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

            // --- OFFERS INTEGRATION ---
            // Fetch all offers that are marked to show on home
            // We can do this in parallel or after.
            // Fetch all offers to ensure badge visibility (User request: show for who has posted)
            const { data: offersData } = await supabase
                .from('offers')
                .select('user_id, card_id');

            // Mark cards with has_active_offer
            sortedCards = sortedCards.map(card => {
                // Simplified: Show offer badge if the USER has any offer (regardless of specific card link)
                // This ensures maximum visibility as requested.
                const hasOffer = offersData?.some(offer => offer.user_id === card.user_id);
                return { ...card, has_active_offer: hasOffer };
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

    const handleExpand = async (card) => {
        // If clicking the same card, collapse it
        if (expandedCardId === card.id) {
            handleCollapse();
            return;
        }

        // Fetch user rating for the new card
        let userRating = 0;
        if (user) {
            const { data } = await supabase.from('card_ratings')
                .select('rating')
                .eq('card_id', card.id)
                .eq('user_id', user.id)
                .maybeSingle();
            if (data) userRating = data.rating;
        }

        const cardWithRating = { ...card, user_rating: userRating };

        // Update view count using RPC for security/atomic increment
        try {
            // NEW: Call RPC function
            await supabase.rpc('increment_card_view', { card_id_input: card.id });

            setCards(prev => prev.map(c => {
                if (c.id === card.id) {
                    return { ...c, view_count: (c.view_count || 0) + 1 };
                }
                return c;
            }));
        } catch (error) {
            console.error('Error updating view count:', error);
        }

        setExpandedCardData(cardWithRating);
        setExpandedCardId(card.id);

        // Smooth scroll to element
        // Give a small delay to allow Grid state modification (col-span-full) to render
        setTimeout(() => {
            const element = cardRefs.current[card.id];
            const mainContainer = mainContainerRef.current;

            if (element && mainContainer) {
                // Mobile: Scroll to view
                if (window.innerWidth < 768) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    return;
                }

                // Desktop: Page-Relative Positioning (Absolute coordinates)
                // Use mainContainer dimensions mainly for width check
                const viewportWidth = mainContainer.clientWidth;
                const POPUP_WIDTH = Math.min(600, viewportWidth - 32);
                const POPUP_HEIGHT_ESTIMATE = 700;

                // Use offset properties for page-relative positioning
                // This ensures the modal stays "at the bottom" if the card is at the bottom
                // We calculate Center-to-Center based on the ELEMENT's page position
                let leftPx = element.offsetLeft + (element.offsetWidth / 2) - (POPUP_WIDTH / 2);
                let topPx = element.offsetTop + (element.offsetHeight / 2) - (POPUP_HEIGHT_ESTIMATE / 2);

                // Clamp Horizontal to Container
                leftPx = Math.max(16, Math.min(leftPx, viewportWidth - POPUP_WIDTH - 16));

                // Clamp Vertical (Just ensure it doesn't go off the very top of the content)
                topPx = Math.max(16, topPx);

                setExpandedPosition({
                    top: topPx,
                    left: leftPx,
                    width: POPUP_WIDTH
                });
            }
        }, 50);
    };

    const handleCollapse = () => {
        setExpandedCardId(null);
        setExpandedCardData(null);
    };

    const renderExpandedView = () => {
        if (!expandedCardData) return null;
        const isLiked = likedCards.has(expandedCardData.id);
        const isSaved = savedCards.has(expandedCardData.id);
        const props = {
            card: expandedCardData,
            isSaved,
            isLiked,
            userRating: expandedCardData.user_rating || 0,
            ratingStats: { average: expandedCardData.rating_avg || 0, count: expandedCardData.rating_count || 0 },
            handleLike: (e) => handleLike(e, expandedCardData.id),
            handleSave: (e) => handleSave(e, expandedCardData.id),
            showRating: true,
            isVerified: expandedCardData.profiles?.is_verified,
            handleRate: async (rating) => {
                if (!user) return navigate('/login');
                const { error } = await addRating(expandedCardData.id, user.id, rating);
                if (!error) {
                    setExpandedCardData(prev => ({ ...prev, user_rating: rating }));
                    fetchCards();
                }
            }
        };

        let CardComponent;
        switch (expandedCardData.template_id) {
            case 'conference-gradient': CardComponent = ConferenceGradientCard; break;
            case 'minimalist': CardComponent = MinimalistCard; break;
            case 'glassmorphism': CardComponent = GlassmorphismCard; break;
            case 'red-geometric': CardComponent = RedGeometricCard; break;
            case 'hero-cover-profile': CardComponent = HeroCoverProfileCard; break;
            case 'professional-dev': CardComponent = ProfessionalDevCard; break;
            case 'flip-card': CardComponent = FlipCard; break;
            case 'circular-modern': CardComponent = CircularModernCard; break;
            case 'modern': default: CardComponent = ModernCard; break;
        }

        return (
            <div className="w-full bg-slate-50 rounded-[32px] p-6 md:p-12 relative animate-fade-in shadow-inner border border-slate-200 mt-4 mb-8 flex flex-col items-center">
                <button
                    onClick={handleCollapse}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors z-10"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>
                <div className="w-full max-w-xl relative">
                    {/* View Offers Overlay Button */}
                    {expandedCardData.has_active_offer && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/offers?user_id=${expandedCardData.user_id}`);
                            }}
                            className="absolute bottom-4 left-4 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform animate-pulse flex items-center gap-2 ring-2 ring-orange-200"
                        >
                            <Flame className="w-4 h-4 fill-white" />
                            <span className="font-bold text-xs">View Offers</span>
                        </button>
                    )}
                    <CardComponent {...props} />
                </div>
            </div>
        );
    };

    return (
        <div ref={mainContainerRef} className="p-4 md:p-8 pb-20 max-w-[1600px] mx-auto min-h-screen relative">
            {/* Header Section */}
            <div className="mb-10 text-center xl:text-left">
                <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Discover Amazing Digital Cards</h1>
                <p className="text-[#94a3b8] text-lg">Connect with professionals worldwide</p>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mt-6 justify-center xl:justify-start">
                    {['All', 'Personal', 'Business', 'Freelancer'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilters({ ...filters, category: cat })}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filters.category === cat
                                ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'
                                }`}
                        >
                            {cat} Cards
                        </button>
                    ))}
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="mb-12 sticky top-24 md:top-4 z-40">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 content-start relative">
                    {cards.map((item, index) => {
                        if (item.type === 'ad') {
                            return <div key={`ad-${item.id}-${index}`} className="col-span-1"><AdCard ad={item} /></div>;
                        }

                        // It is a card
                        const card = item;
                        const isExpanded = expandedCardId === card.id;

                        // Identify if this row should be handled differently? 
                        // CSS Grid auto-flow with col-span-full naturally pushes items down.
                        // However, standard Masonry or some grid libraries might mess this up, 
                        // but `grid-cols-X` usually handles explicit col-spans by breaking the row.

                        return (
                            <React.Fragment key={card.id}>
                                {/* 
                                    If expanded, we render the container as col-span-full.
                                    Inside, we can render TWO things or ONE thing?
                                    Option A: Render the Card Item AND the Expanded View separately?
                                    Option B: Determine visually what we want. 
                                    User wants: "Expands inline". 
                                    Usually this means the Grid Item *becomes* the Expanded view, 
                                    OR the Expanded view appears *below* the current row.
                                    
                                    If we set col-span-full on the Card Item itself, 
                                    it becomes huge. That might be okay if we change its internal layout?
                                    
                                    Or, we wrap the Item and the Expanded content in a Fragment.
                                    The Item stays col-span-1.
                                    The Expanded Content is a sibling with col-span-full.
                                    
                                    If we do that, the Expanded Content will appear *after* this card.
                                    In a dense grid, that might be right next to it, 
                                    or it might leave a gap if the grid isn't dense.
                                    
                                    Actually, for a true "Google Images" style inline expansion in a grid,
                                    you typically insert a row *after* the current visual row. 
                                    That requires knowing how many cols are in the row to calculate 
                                    where to insert the full-width item. 
                                    
                                    Simpler approach requested: "Inline expandable card".
                                    If I make this specific card `col-span-full`, it will take the WHOLE row.
                                    Previous cards stay above. Following cards go below.
                                    This is the most robust "CSS Grid only" way without complex JS math for rows.
                                    
                                    Let's try: 
                                    Container is `col-span-1` normally.
                                    If expanded, Container becomes `col-span-full`.
                                    Inside Container, we switch from `CardItem` to `DetailedView`?
                                    Or we show `DetailedView`?
                                    
                                    If we switch completely, the small card disappears.
                                    That might be disorienting.
                                    
                                    Better UX:
                                    When expanded, show the Enhanced View which typically *contains* the card details 
                                    plus extra stuff. The detailed view I built above has the card preview in it.
                                    So essentially we are swapping the "Thumbnail" for the "Main View".
                                    
                                    So, yes: Container becomes col-span-full.
                                    Content changes to `renderExpandedView`.
                                */}

                                <div
                                    ref={el => cardRefs.current[card.id] = el}
                                    className={`transition-all duration-300 h-full ${isExpanded ? 'col-span-1 md:col-span-1' : 'col-span-1'}`}
                                >
                                    {isExpanded ? (
                                        <>
                                            {/* Mobile: Show Exapnded View Inline */}
                                            <div className="md:hidden">
                                                {renderExpandedView()}
                                            </div>

                                            {/* Desktop: Show Normal Card Item (Modal handles detailed view) */}
                                            <div className="hidden md:block h-full">
                                                <CardItem
                                                    card={card}
                                                    isLiked={likedCards.has(card.id)}
                                                    isSaved={savedCards.has(card.id)}
                                                    isVerified={card.profiles?.is_verified}
                                                    ratingAvg={card.rating_avg}
                                                    ratingCount={card.rating_count}
                                                    onLike={(e) => handleLike(e, card.id)}
                                                    onSave={(e) => handleSave(e, card.id)}
                                                    onView={handleExpand}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <CardItem
                                            card={card}
                                            isLiked={likedCards.has(card.id)}
                                            isSaved={savedCards.has(card.id)}
                                            isVerified={card.profiles?.is_verified}
                                            ratingAvg={card.rating_avg}
                                            ratingCount={card.rating_count}
                                            onLike={(e) => handleLike(e, card.id)}
                                            onSave={(e) => handleSave(e, card.id)}
                                            onView={handleExpand}
                                        />
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}


            {/* Desktop Modal Overlay */}
            {/* Desktop Modal/Popup Overlay */}
            {expandedCardData && (
                <>
                    {/* Blurred Fixed Backdrop */}
                    <div className="hidden md:block fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-300" onClick={handleCollapse}></div>

                    {/* Absolute Popup Content Positioned Relative to Page/Container */}
                    <div
                        className="hidden md:flex absolute z-50 flex-col items-center transition-all duration-300 ease-out animate-scale-up origin-center"
                        style={{
                            top: expandedPosition.top,
                            left: expandedPosition.left,
                            width: expandedPosition.width,
                            maxHeight: '90vh' // Use vh for max height to ensure internal scrolling if needed
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full overflow-y-auto bg-slate-50 rounded-[32px] p-6 shadow-2xl flex flex-col items-center border border-white/40">
                            <button
                                onClick={handleCollapse}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>

                            {/* Reuse Render Logic */}
                            {(() => {
                                const isLiked = likedCards.has(expandedCardData.id);
                                const isSaved = savedCards.has(expandedCardData.id);
                                const props = {
                                    card: expandedCardData,
                                    isSaved,
                                    isLiked,
                                    userRating: expandedCardData.user_rating || 0,
                                    ratingStats: { average: expandedCardData.rating_avg || 0, count: expandedCardData.rating_count || 0 },
                                    handleLike: (e) => handleLike(e, expandedCardData.id),
                                    handleSave: (e) => handleSave(e, expandedCardData.id),
                                    showRating: true,
                                    isVerified: expandedCardData.profiles?.is_verified,
                                    handleRate: async (rating) => {
                                        if (!user) return navigate('/login');
                                        const { error } = await addRating(expandedCardData.id, user.id, rating);
                                        if (!error) {
                                            setExpandedCardData(prev => ({ ...prev, user_rating: rating }));
                                            fetchCards();
                                        }
                                    }
                                };

                                let CardComponent;
                                switch (expandedCardData.template_id) {
                                    case 'conference-gradient': CardComponent = ConferenceGradientCard; break;
                                    case 'minimalist': CardComponent = MinimalistCard; break;
                                    case 'glassmorphism': CardComponent = GlassmorphismCard; break;
                                    case 'red-geometric': CardComponent = RedGeometricCard; break;
                                    case 'hero-cover-profile': CardComponent = HeroCoverProfileCard; break;
                                    case 'professional-dev': CardComponent = ProfessionalDevCard; break;
                                    case 'flip-card': CardComponent = FlipCard; break;
                                    case 'circular-modern': CardComponent = CircularModernCard; break;
                                    case 'modern': default: CardComponent = ModernCard; break;
                                }

                                return (
                                    <div className="w-full flex justify-center relative">
                                        {/* View Offers Overlay Button */}
                                        {expandedCardData.has_active_offer && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/offers?user_id=${expandedCardData.user_id}`);
                                                }}
                                                className="absolute bottom-6 left-6 z-[60] bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse flex items-center gap-2 ring-4 ring-orange-200"
                                            >
                                                <Flame className="w-5 h-5 fill-white" />
                                                <span className="font-bold text-sm">View Offers</span>
                                            </button>
                                        )}
                                        <CardComponent {...props} />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default Home;
