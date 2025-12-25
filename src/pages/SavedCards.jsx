import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Heart, Search, X, Flame } from 'lucide-react';
import CardItem from '../components/UI/CardItem';

// Templates
import ModernCard from '../components/Templates/ModernCard';
import ConferenceGradientCard from '../components/Templates/ConferenceGradientCard';
import MinimalistCard from '../components/Templates/MinimalistCard';
import GlassmorphismCard from '../components/Templates/GlassmorphismCard';
import RedGeometricCard from '../components/Templates/RedGeometricCard';
import HeroCoverProfileCard from '../components/Templates/HeroCoverProfileCard';
import ProfessionalDevCard from '../components/Templates/ProfessionalDevCard';
import CircularModernCard from '../components/Templates/CircularModernCard';

const SavedCards = () => {
    const navigate = useNavigate();
    const [savedCards, setSavedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        fetchSavedCards();
    }, []);

    const fetchSavedCards = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch saved cards with necessary profile data
            const { data, error } = await supabase
                .from('saved_cards')
                .select(`
                    card_id,
                    cards:card_id (
                        *,
                        profiles (subscription_plan, subscription_expiry, is_verified)
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            // Format data
            const formatted = data.map(item => item.cards);
            setSavedCards(formatted || []);
        } catch (error) {
            console.error('Error fetching saved cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (e, cardId) => {
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('saved_cards').delete().eq('user_id', user.id).eq('card_id', cardId);
        setSavedCards(prev => prev.filter(c => c.id !== cardId));
        if (selectedCard && selectedCard.id === cardId) {
            setSelectedCard(null);
        }
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const renderCardTemplate = (card) => {
        const props = {
            card,
            isSaved: true,
            isLiked: false, // You might want to fetch this status if needed
            ratingStats: { average: card.rating_avg || 0, count: card.rating_count || 0 },
            handleLike: () => { }, // Implement like logic if needed
            handleSave: (e) => handleUnsave(e, card.id),
            handleRate: () => { }, // Implement rate logic if needed
            showRating: true,
            isVerified: card.profiles?.is_verified,
        };

        switch (card.template_id) {
            case 'conference-gradient': return <ConferenceGradientCard {...props} />;
            case 'minimalist': return <MinimalistCard {...props} />;
            case 'glassmorphism': return <GlassmorphismCard {...props} />;
            case 'red-geometric': return <RedGeometricCard {...props} />;
            case 'hero-cover-profile': return <HeroCoverProfileCard {...props} />;
            case 'professional-dev': return <ProfessionalDevCard {...props} />;
            case 'circular-modern': return <CircularModernCard {...props} />;
            case 'modern': default: return <ModernCard {...props} />;
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#7B4BFF]" /></div>;

    return (
        <div className="p-8 pb-20 max-w-[1600px] mx-auto min-h-screen relative">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Saved Cards</h1>

            {savedCards.length === 0 ? (
                <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] border border-gray-50">
                    <div className="w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mb-6 shadow-inner">
                        <Heart className="w-10 h-10 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">No saved cards yet</h2>
                    <p className="text-slate-400 mb-8 text-lg">Start browsing to build your professional network</p>
                    <Link to="/" className="bg-gradient-to-r from-[#7B4BFF] to-[#A07BFF] hover:opacity-90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5">
                        Browse Cards
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {savedCards.map(card => (
                        <CardItem
                            key={card.id}
                            card={card}
                            isLiked={false}
                            isSaved={true}
                            ratingAvg={card.rating_avg || 4.5}
                            ratingCount={card.rating_count || 0}
                            onLike={() => { }}
                            onSave={(e) => handleUnsave(e, card.id)}
                            onView={(card) => setSelectedCard(card)}
                        />
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {selectedCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}>
                    <div
                        className="relative bg-slate-50 rounded-[32px] p-6 max-h-[90vh] overflow-y-auto w-full max-w-2xl shadow-2xl border border-white/20 animate-scale-up"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-100 transition-colors z-10"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>

                        <div className="flex justify-center">
                            {/* View Offers Overlay Button */}
                            {selectedCard.has_active_offer && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/offers?user_id=${selectedCard.user_id}`);
                                    }}
                                    className="absolute bottom-6 left-6 z-[60] bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse flex items-center gap-2 ring-4 ring-orange-200"
                                >
                                    <Flame className="w-5 h-5 fill-white" />
                                    <span className="font-bold text-sm">View Offers</span>
                                </button>
                            )}
                            {renderCardTemplate(selectedCard)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedCards;
