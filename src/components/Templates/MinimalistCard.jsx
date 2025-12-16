import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Star, BadgeCheck } from 'lucide-react';

const MinimalistCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const SocialIcon = ({ platform }) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-5 h-5" />;
            case 'facebook': return <Facebook className="w-5 h-5" />;
            case 'linkedin': return <Linkedin className="w-5 h-5" />;
            case 'twitter': return <Twitter className="w-5 h-5" />;
            case 'youtube': return <Youtube className="w-5 h-5" />;
            case 'website': return <Globe className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 shadow-sm relative min-h-[500px] flex flex-col items-center pt-12 pb-8 px-6 text-center">

            <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2 border-gray-100">
                {card.avatar_url ? (
                    <img src={card.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400 font-light">{card.name[0]}</div>
                )}
            </div>

            <h1 className="text-2xl font-light text-slate-900 mb-1 flex items-center justify-center gap-1">
                {card.name}
                {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />}
            </h1>
            <p className="text-slate-500 text-sm mb-4">{card.profession}</p>

            {/* Rating Section */}
            {showRating && (
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="flex items-center gap-1 mb-2">
                        <span className="font-bold text-slate-800">{ratingStats?.average || '0.0'}</span>
                        <span className="text-xs text-slate-400">({ratingStats?.count || 0})</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                disabled={userRating > 0}
                                className={`p-1 hover:scale-110 transition-transform ${star <= (hoverRating || userRating) ? 'text-amber-400' : 'text-slate-100 hover:text-amber-300'}`}
                            >
                                <Star
                                    className="w-6 h-6"
                                    fill={star <= (hoverRating || userRating) ? "currentColor" : "none"}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full space-y-4 mb-8">
                {card.phone && <a href={`tel:${card.phone}`} className="block py-3 border-b border-gray-100 text-slate-600 hover:text-black transition-colors">{card.phone}</a>}
                {card.email && <a href={`mailto:${card.email}`} className="block py-3 border-b border-gray-100 text-slate-600 hover:text-black transition-colors">{card.email}</a>}
                {card.website && <a href={card.website} target="_blank" className="block py-3 border-b border-gray-100 text-slate-600 hover:text-black transition-colors">Visit Website</a>}
                {(card.google_map_link || card.location) && (
                    <div className="mt-4">
                        <a
                            href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                            target="_blank"
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                        >
                            <MapPin className="w-5 h-5 text-slate-400 group-hover:text-black" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-black">View Location from Map</span>
                        </a>
                    </div>
                )}
            </div>

            <div className="flex gap-4 mb-8">
                {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" className="text-slate-400 hover:text-black transition-colors">
                        <SocialIcon platform={platform} />
                    </a>
                ))}
            </div>

            <div className="mt-auto flex gap-4">
                <button onClick={handleLike} className={`px-6 py-2 border rounded-none uppercase text-xs tracking-wider transition-all ${isLiked ? 'bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`}>
                    {isLiked ? 'Liked' : 'Like'}
                </button>
                <button onClick={handleSave} className={`px-6 py-2 border rounded-none uppercase text-xs tracking-wider transition-all ${isSaved ? 'bg-black text-white' : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'}`}>
                    {isSaved ? 'Saved' : 'Save'}
                </button>
            </div>

        </div>
    );
};

export default MinimalistCard;
