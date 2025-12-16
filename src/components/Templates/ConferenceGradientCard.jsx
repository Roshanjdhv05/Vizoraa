import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Star, BadgeCheck } from 'lucide-react';

const ConferenceGradientCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {

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
        <div className="w-full max-w-sm bg-gradient-to-b from-[#EEDBFF] to-[#F8F2FF] rounded-[28px] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">

            {/* Left Decorative Dot Pattern */}
            <div className="absolute left-4 top-4 bottom-4 w-6 flex flex-col justify-between z-0 pointer-events-none">
                {/* 3x3 Grid Top Left */}
                <div className="grid grid-cols-3 gap-1 mb-4">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-black rounded-full opacity-60"></div>
                    ))}
                </div>

                {/* Vertical Dotted Line */}
                <div className="h-full flex flex-col items-center gap-1.5 opacity-20">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 bg-black rounded-full"></div>
                    ))}
                </div>
            </div>

            {/* Header Content */}
            <div className="pt-8 px-8 pb-4 text-center z-10">
                <div className="flex justify-center mb-3">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {card.avatar_url ? (
                            <img src={card.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-black" />
                        ) : (
                            card.name[0]
                        )}
                    </div>
                </div>

                <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-2 opacity-80">
                    Online Business Conference
                </h2>

                <h1 className="text-3xl font-bold text-black leading-tight mb-0.5 flex items-center justify-center gap-2">
                    {card.name}
                    {isVerified && <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500 text-white" />}
                </h1>

                <p className="text-gray-500 italic text-sm mb-4">
                    {card.profession}
                </p>

                {card.company && (
                    <p className="text-gray-400 text-sm font-medium">
                        {card.company}
                    </p>
                )}
            </div>

            {/* Rating Section */}
            {showRating && (
                <div className="flex flex-col items-center justify-center mb-4">
                    <div className="flex items-center gap-1 mb-2 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        <span className="font-bold text-slate-800">{ratingStats?.average || '0.0'}</span>
                        <span className="text-xs text-slate-500">({ratingStats?.count || 0})</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                disabled={userRating > 0}
                                className={`transition-transform hover:scale-110 focus:outline-none ${star <= (hoverRating || userRating) ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
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

            {/* Contact Info */}
            <div className="px-10 py-4 flex-1 flex flex-col gap-5 z-10">

                {card.email && (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">Email:</span>
                        <a href={`mailto:${card.email}`} className="text-sm text-gray-600 hover:text-black transition-colors truncate">
                            {card.email}
                        </a>
                    </div>
                )}

                {card.phone && (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">Phone:</span>
                        <a href={`tel:${card.phone}`} className="text-sm text-gray-600 hover:text-black transition-colors">
                            {card.phone}
                        </a>
                    </div>
                )}

                {(card.location || card.google_map_link) && (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-black flex items-center gap-1">
                            Location <MapPin className="w-3 h-3" />
                        </span>

                        <a
                            href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-gray-600 transition-colors hover:text-black hover:underline cursor-pointer"
                        >
                            {card.location || "View on Google Maps"}
                        </a>
                    </div>
                )}

                {/* Social Icons Row */}
                <div className="flex flex-wrap gap-3 mt-4">
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noreferrer" className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                            <Globe className="w-4 h-4" />
                        </a>
                    )}
                    {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noreferrer" className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                            <SocialIcon platform={platform} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Floating Call Button */}
            {card.phone && (
                <div className="absolute left-8 bottom-8 z-20">
                    <a
                        href={`tel:${card.phone}`}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-bounce"
                        title="Call Now"
                    >
                        <Phone className="w-5 h-5 fill-current" />
                    </a>
                </div>
            )}

            {/* Contextual Actions (Save/Like) positioned discreetly */}
            <div className="absolute right-6 bottom-8 flex flex-col gap-3 z-20">
                <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isLiked ? 'bg-pink-500 text-white' : 'bg-white text-gray-400 hover:text-pink-500 hover:bg-pink-50'}`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                    onClick={handleSave}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isSaved ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default ConferenceGradientCard;

