import React, { useState } from 'react';
import { Heart, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const OfferCard = ({ offer, currentUserId }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(offer.is_liked_by_user);
    const [likeCount, setLikeCount] = useState(offer.like_count || 0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!currentUserId) {
            navigate('/login');
            return;
        }

        // Optimistic UI update
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

        try {
            if (newLikedState) {
                await supabase.from('offer_likes').insert({ user_id: currentUserId, offer_id: offer.id });
            } else {
                await supabase.from('offer_likes').delete().eq('user_id', currentUserId).eq('offer_id', offer.id);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            setIsLiked(!newLikedState);
            setLikeCount(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
        }
    };

    const handleUserClick = (e) => {
        e.stopPropagation();
        // Assuming we can navigate to the user's main card. 
        // Typically we need a card_id. The offer is linked to user_id. 
        // Alternatively, we navigate to the first card owned by this user.
        // For now, we'll try navigating to `/c/find_by_user/${offer.user_id}` or similar logic if implemented,
        // OR we passed the user's primary card info in the query.

        // Strategy: The fetch query should join 'cards' to get the user's primary card ID.
        // If not available, we might just show user profile interactions.

        if (offer.cards && offer.cards.length > 0) {
            navigate(`/c/${offer.cards[0].id}`);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div
            onClick={handleUserClick}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer group"
        >
            {/* Header: User Info */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        {offer.user_avatar ? (
                            <img src={offer.user_avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                {offer.user_name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                            {offer.user_name || 'Anonymous'}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {formatDate(offer.created_at)}
                        </div>
                    </div>
                </div>
                {/* External Link indication */}
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </div>

            {/* Offer Image */}
            <div className="relative aspect-video bg-slate-50 overflow-hidden">
                {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
                <img
                    src={offer.image_url}
                    alt={offer.title}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Content */}
            <div className="p-5">
                {offer.title && (
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{offer.title}</h3>
                )}
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {offer.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>

                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
