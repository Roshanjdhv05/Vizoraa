import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Star, BadgeCheck } from 'lucide-react';

const CircularModernCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const themeColor = card.theme_color || '#10b981'; // Green default

    const SocialIcon = ({ platform }) => {
        switch (platform?.toLowerCase()) {
            case 'instagram': return <Instagram className="w-4 h-4" />;
            case 'facebook': return <Facebook className="w-4 h-4" />;
            case 'linkedin': return <Linkedin className="w-4 h-4" />;
            case 'twitter': return <Twitter className="w-4 h-4" />;
            case 'youtube': return <Youtube className="w-4 h-4" />;
            case 'website': return <Globe className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    };

    return (
        <div
            className="mx-auto group relative"
            style={{
                perspective: '1000px'
            }}
        >
            {/* Responsive Container Dimensions using Tailwind */}
            <div className="w-full max-w-[340px] md:max-w-none md:w-[500px] h-[550px] md:h-[300px] transition-all duration-300 mx-auto">
                <div
                    className="relative w-full h-full transition-transform duration-700"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        cursor: 'pointer'
                    }}
                >
                    {/* --- BACK SIDE --- */}
                    {/* Rendered first but z-index controlled */}
                    <div
                        className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse"
                        style={{
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 0
                        }}
                    >
                        {/* Visual Section (Avatar/Socials) */}
                        {/* Mobile: Top (h-2/5) | Desktop: Right (w-1/3) */}
                        <div className="w-full md:w-1/3 h-[40%] md:h-full bg-slate-100 relative flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-l border-slate-100">
                            <div className="w-20 h-20 md:w-20 md:h-20 rounded-full shadow-inner overflow-hidden mb-4 border-4 border-white">
                                {card.avatar_url ? (
                                    <img src={card.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-200" />
                                )}
                            </div>

                            {/* Social Links Grid */}
                            <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                                {card.website && (
                                    <a
                                        href={card.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        style={{ '--hover-bg': themeColor }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = themeColor; e.currentTarget.style.color = 'white' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#64748b' }}
                                    >
                                        <Globe className="w-4 h-4" />
                                    </a>
                                )}
                                {card.social_links && Object.entries(card.social_links).slice(0, 6).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        style={{ '--hover-bg': themeColor }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = themeColor; e.currentTarget.style.color = 'white' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#64748b' }}
                                    >
                                        <SocialIcon platform={platform} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Details Section */}
                        {/* Mobile: Bottom (h-3/5) | Desktop: Left (w-2/3) */}
                        <div className="w-full md:w-2/3 h-[60%] md:h-full p-6 flex flex-col relative overflow-hidden">
                            <div className="mb-4 text-center md:text-left">
                                <h2 className="text-xl font-bold text-slate-800">{card.name}</h2>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{card.company}</p>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                {/* About Section */}
                                {card.about && (
                                    <p className="text-xs text-slate-600 mb-3 italic break-words whitespace-pre-wrap md:border-l-2 md:pl-2 px-2 md:px-0 text-center md:text-left" style={{ borderColor: themeColor }}>
                                        {card.about}
                                    </p>
                                )}

                                {/* Contacts */}
                                <div className="space-y-3">
                                    {card.phone && (
                                        <a href={`tel:${card.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 text-sm text-slate-600 hover:text-black transition-colors group">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors shrink-0" style={{ '--group-hover-bg': themeColor }}>
                                                <Phone className="w-3 h-3" />
                                            </div>
                                            <span className="truncate">{card.phone}</span>
                                        </a>
                                    )}
                                    {card.email && (
                                        <a href={`mailto:${card.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 text-sm text-slate-600 hover:text-black transition-colors group">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors shrink-0" style={{ '--group-hover-bg': themeColor }}>
                                                <Mail className="w-3 h-3" />
                                            </div>
                                            <span className="truncate">{card.email}</span>
                                        </a>
                                    )}
                                    {(card.location || card.google_map_link) && (
                                        <a
                                            href={card.google_map_link || '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-3 text-sm text-slate-600 hover:text-black transition-colors group">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors shrink-0" style={{ '--group-hover-bg': themeColor }}>
                                                <MapPin className="w-3 h-3" />
                                            </div>
                                            <span className="truncate">{card.location || 'Location'}</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={handleLike}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-slate-100 text-slate-400 hover:bg-pink-50 hover:text-pink-500'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSaved ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                                </button>

                                {/* Star Rating Interactive */}
                                {showRating && (
                                    <div className="ml-auto flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={(e) => { e.stopPropagation(); handleRate(star); }}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                disabled={userRating > 0}
                                                className={`${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`}
                                            >
                                                <Star className="w-4 h-4 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- FRONT SIDE --- */}
                    {/* Rendered LAST (on top in DOM) with backface hidden */}
                    <div
                        className="absolute inset-0 w-full h-full bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 1
                        }}
                    >
                        {/* Image Section */}
                        {/* Mobile: Top (h-1/2) | Desktop: Left (w-5/12) */}
                        <div className="w-full md:w-5/12 h-[45%] md:h-full relative bg-slate-800 overflow-hidden flex items-center justify-center">
                            {/* Concentric Rings */}
                            <div className="absolute w-[200%] h-[200%] rounded-full border-[20px] border-yellow-500/10 animate-pulse-slow"></div>
                            <div className="absolute w-[150%] h-[150%] rounded-full border-[20px] border-green-500/10"></div>

                            {/* Profile Image */}
                            <div className="relative z-10 w-32 h-32 md:w-24 md:h-24 rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden bg-slate-600">
                                {card.avatar_url ? (
                                    <img src={card.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                                        {card.name ? card.name[0] : 'V'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Section */}
                        {/* Mobile: Bottom (h-1/2) | Desktop: Right (w-7/12) */}
                        <div className="w-full md:w-7/12 h-[55%] md:h-full p-6 flex flex-col justify-center items-center md:items-start text-center md:text-left relative">
                            {/* Name & Role */}
                            <div className="mb-4 md:mb-2">
                                <h1 className="text-2xl md:text-2xl font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-center md:justify-start gap-2">
                                    {card.name}
                                    {isVerified && <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-500/20" />}
                                </h1>
                                <p className="text-sm font-medium tracking-wide" style={{ color: themeColor }}>
                                    {card.profession}
                                </p>
                            </div>

                            <div className="w-12 h-1 bg-slate-700 rounded-full mb-8 md:mb-4"></div>

                            <p className="text-xs text-slate-400">Tap to flip & view details</p>

                            {/* Front Actions (Absolute) */}
                            <div className="absolute bottom-4 right-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                {/* Rating Mini Display */}
                                {showRating && (
                                    <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur text-xs mr-2">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-white font-bold">{ratingStats?.average || '0.0'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircularModernCard;
