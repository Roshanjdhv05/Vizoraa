import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Share2, Heart, Download, Loader2, Facebook, Instagram, Linkedin, Youtube, Bookmark, Star, BadgeCheck } from 'lucide-react';

const ModernCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
    const [hoverRating, setHoverRating] = useState(0);

    // Helper for Star Display (Average)
    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };


    // Social Icon Helper
    const SocialIcon = ({ platform }) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-5 h-5" />;
            case 'facebook': return <Facebook className="w-5 h-5" />;
            case 'linkedin': return <Linkedin className="w-5 h-5" />;
            case 'youtube': return <Youtube className="w-5 h-5" />;
            case 'website': return <Globe className="w-5 h-5" />;
            case 'twitter': return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 9.66 9.66 0 0 0-4.17-6 19.3 19.3 0 0 0-6.15 1.7 15.42 15.42 0 0 1-11.2-5.7 6.16 6.16 0 0 0-.8 3.1 6.18 6.18 0 0 0 2.74 5.14 6.2 6.2 0 0 1-2.8-.78v.08a6.19 6.19 0 0 0 4.96 6.07 6.2 6.2 0 0 1-2.8.11 6.22 6.22 0 0 0 5.8 4.32 12.44 12.44 0 0 1-7.7 2.65 12.62 12.62 0 0 1-1.48-.09 17.58 17.58 0 0 0 9.53 2.8c11.43 0 17.68-9.5 17.68-17.76 0-.27 0-.54-.07-.81A12.7 12.7 0 0 0 22 5.8z" /></svg>;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Header / Banner */}
            <div
                className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 relative p-6 text-white flex flex-col justify-between"
                style={{ background: card.theme_color ? `linear-gradient(135deg, ${card.theme_color}, #4f46e5)` : undefined }}
            >
                <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                        {card.avatar_url ? (
                            <img src={card.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            card.name[0]
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLike}
                            className={`p-2 backdrop-blur-md rounded-full transition-colors ${isLiked ? 'bg-pink-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={handleSave}
                            className={`p-2 backdrop-blur-md rounded-full transition-colors ${isSaved ? 'bg-emerald-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                <div>
                    <h1 className="text-xl font-bold flex items-center gap-1">
                        {card.name}
                        {isVerified && <BadgeCheck className="w-5 h-5 text-blue-200 fill-blue-500" />}
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium">{card.profession}</p>
                    <div className="flex items-center gap-1 text-xs text-indigo-100 mt-1 opacity-90">
                        <MapPin className="w-3 h-3" />
                        <a
                            href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {card.location || 'Location not set'}
                        </a>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">

                {/* About Section */}
                {card.about && (
                    <div className="w-full">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">About</h2>
                        <p className="text-slate-600 text-sm leading-relaxed break-words whitespace-pre-wrap">{card.about}</p>
                    </div>
                )}

                {/* Rating Section */}
                {showRating && (
                    <div className="flex flex-col items-center justify-center p-5 bg-slate-50/50 rounded-2xl border border-slate-100 mb-2">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl font-bold text-slate-800">{ratingStats?.average || '0.0'}</span>
                            <span className="text-slate-400 text-sm ml-1">({ratingStats?.count || 0} ratings)</span>
                        </div>

                        {/* Interactive Rating Input */}
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    disabled={userRating > 0}
                                    className={`transition-transform hover:scale-110 focus:outline-none ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
                                >
                                    <Star
                                        className="w-8 h-8"
                                        fill={star <= (hoverRating || userRating) ? "currentColor" : "none"}
                                    />
                                </button>
                            ))}
                        </div>
                        {userRating > 0 ? (
                            <p className="text-xs text-green-600 font-medium mt-2">Thanks for rating!</p>
                        ) : (
                            <p className="text-xs text-slate-400 mt-2">Tap stars to rate</p>
                        )}
                    </div>
                )}

                {/* Contact Actions */}
                <div className="space-y-3">
                    {card.phone && (
                        <a href={`tel:${card.phone}`} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-500 text-xs">Phone</p>
                                <p className="font-medium text-slate-800">{card.phone}</p>
                            </div>
                        </a>
                    )}
                    {card.email && (
                        <a href={`mailto:${card.email}`} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-500 text-xs">Email</p>
                                <p className="font-medium text-slate-800">{card.email}</p>
                            </div>
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-500 text-xs">Website</p>
                                <p className="font-medium text-slate-800">{card.website.replace(/^https?:\/\//, '')}</p>
                            </div>
                        </a>
                    )}
                </div>

                {(card.google_map_link || card.location) && (
                    <div className="mt-3">
                        <a
                            href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group border border-slate-100 shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-500 text-xs">Location</p>
                                <p className="font-medium text-slate-800">View on Google Maps</p>
                            </div>
                        </a>
                    </div>
                )}

                {/* Social Links Row */}
                {card.social_links && Object.keys(card.social_links).length > 0 && (
                    <div className="flex justify-center gap-4 py-4">
                        {Object.entries(card.social_links).map(([platform, url]) => (
                            <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-slate-200"
                            >
                                <SocialIcon platform={platform} />
                            </a>
                        ))}
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button onClick={handleSave} className={`w-full py-3.5 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${isSaved ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5'}`}>
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved to Contacts' : 'Save Contact'}
                    </button>
                    <p className="text-center text-xs text-slate-400">Tap icons to connect</p>
                </div>

            </div>
        </div>
    );
};

export default ModernCard;
