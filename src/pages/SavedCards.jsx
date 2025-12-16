import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Loader2, Heart, Search } from 'lucide-react';
import CardItem from '../components/UI/CardItem';

const SavedCards = () => {
    const [savedCards, setSavedCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedCards();
    }, []);

    const fetchSavedCards = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('saved_cards')
                .select(`
                    card_id,
                    cards:card_id (*)
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            // Format data similar to Home
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
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#7B4BFF]" /></div>;

    return (
        <div className="p-8 pb-20 max-w-[1600px] mx-auto">
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
                            isLiked={false} // Would likely need to fetch this to be accurate, setting false for now or fetch
                            isSaved={true}
                            ratingAvg={card.rating_avg || 4.5} // Mock or fetch
                            ratingCount={card.rating_count || 0}
                            onLike={() => { }}
                            onSave={(e) => handleUnsave(e, card.id)}
                            onView={() => { }} // Could navigate
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedCards;
