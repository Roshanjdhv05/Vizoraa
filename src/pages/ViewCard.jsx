import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, QrCode, Flame } from 'lucide-react'; // Added QrCode icon
import ModernCard from '../components/Templates/ModernCard';
import ConferenceGradientCard from '../components/Templates/ConferenceGradientCard';
import MinimalistCard from '../components/Templates/MinimalistCard';
import GlassmorphismCard from '../components/Templates/GlassmorphismCard';
import RedGeometricCard from '../components/Templates/RedGeometricCard';
import ProfessionalDevCard from '../components/Templates/ProfessionalDevCard';
import CircularModernCard from '../components/Templates/CircularModernCard';

import { getCardRating, addRating } from '../lib/supabaseClient';
import { Star } from 'lucide-react';
import QRCodeModal from '../components/UI/QRCodeModal'; // Added Modal

const ViewCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [ratingStats, setRatingStats] = useState({ count: 0, average: 0 });
    const [showQR, setShowQR] = useState(false); // State for QR Modal

    useEffect(() => {
        checkUser();
        fetchCard();
        fetchRatingStats();
    }, [id]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            // Check if saved
            const { data: saved } = await supabase.from('saved_cards').select('id').eq('user_id', user.id).eq('card_id', id).single();
            setIsSaved(!!saved);

            // Check if liked
            const { data: liked } = await supabase.from('card_likes').select('id').eq('user_id', user.id).eq('card_id', id).single();
            setIsLiked(!!liked);

            // Check rating
            const { data: rating } = await supabase.from('card_ratings').select('rating').eq('user_id', user.id).eq('card_id', id).single();
            if (rating) setUserRating(rating.rating);
        }
    };

    const fetchCard = async () => {
        try {
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Check for active offers for this user
            const { data: offers } = await supabase
                .from('offers')
                .select('id')
                .eq('user_id', data.user_id)
                .eq('show_on_card', true)
                .limit(1);

            setCard({ ...data, has_offers: offers && offers.length > 0 });

            await supabase.from('cards').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id);

        } catch (err) {
            setError('Card not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchRatingStats = async () => {
        const stats = await getCardRating(id);
        setRatingStats(stats);
    };

    const handleSave = async () => {
        if (!user) return navigate('/login');
        if (isSaved) {
            await supabase.from('saved_cards').delete().eq('user_id', user.id).eq('card_id', id);
            setIsSaved(false);
        } else {
            await supabase.from('saved_cards').insert({ user_id: user.id, card_id: id });
            setIsSaved(true);
        }
    };

    const handleLike = async () => {
        if (!user) return navigate('/login');
        if (isLiked) {
            await supabase.from('card_likes').delete().eq('user_id', user.id).eq('card_id', id);
            setIsLiked(false);
        } else {
            await supabase.from('card_likes').insert({ user_id: user.id, card_id: id });
            setIsLiked(true);
        }
    };

    const handleRate = async (rating) => {
        if (!user) return navigate('/login');
        if (userRating > 0) return;

        setUserRating(rating);

        const { error } = await addRating(id, user.id, rating);
        if (error) {
            console.error('Error rating:', error);
        } else {
            fetchRatingStats();
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">{error}</div>;
    if (!card) return null;

    const renderTemplate = () => {
        const props = { card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats };

        switch (card.template_id) {
            case 'conference-gradient': return <ConferenceGradientCard {...props} />;
            case 'minimalist': return <MinimalistCard {...props} />;
            case 'glassmorphism': return <GlassmorphismCard {...props} />;
            case 'red-geometric': return <RedGeometricCard {...props} />;
            case 'professional-dev': return <ProfessionalDevCard {...props} />;
            case 'circular-modern': return <CircularModernCard {...props} />;
            case 'modern': default: return <ModernCard {...props} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 gap-8 relative">

            {/* QR Code Trigger Button */}
            <button
                onClick={() => setShowQR(true)}
                className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-110 flex items-center gap-2"
            >
                <QrCode className="w-5 h-5" />
                <span className="font-bold text-sm pr-1">QR Code</span>
            </button>

            {/* View Offers Button (if active offers exist) */}
            {card.has_offers && (
                <button
                    onClick={() => navigate(`/offers?user_id=${card.user_id}`)}
                    className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse flex items-center gap-2 ring-4 ring-orange-200"
                >
                    <Flame className="w-5 h-5 fill-white" />
                    <span className="font-bold text-sm pr-1">View Offers</span>
                </button>
            )}

            {renderTemplate()}



            {/* QR Modal */}
            {showQR && (
                <QRCodeModal card={card} onClose={() => setShowQR(false)} />
            )}
        </div>
    );
};

export default ViewCard;
