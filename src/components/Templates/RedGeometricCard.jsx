import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Share2, Star, BadgeCheck } from 'lucide-react';

const RedGeometricCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
    if (!card) return null;
    const [isFlipped, setIsFlipped] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    // Default to Red if no theme_color provided
    const themeColor = card.theme_color || '#EF4444';

    // Social Icon Helper
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
        <div className="relative w-[340px] md:w-[500px] mx-auto group">
            {/* 1. FLIP CONTAINER */}
            <div
                className="w-full relative cursor-pointer"
                style={{
                    perspective: '1000px',
                    aspectRatio: window.innerWidth >= 768 ? '1.586 / 1' : '0.65 / 1'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* 2. FLIP INNER */}
                <div
                    className={`relative w-full h-full transition-transform duration-700`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* 3. FRONT SIDE */}
                    <div
                        className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', zIndex: 2 }}
                    >
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black z-0"></div>
                        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-30" style={{ backgroundImage: `radial-gradient(circle at 10% 20%, ${themeColor} 0%, transparent 20%)` }}></div>

                        {/* Content */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">

                            {/* Logo Area */}
                            <div className="w-20 h-20 md:w-24 md:h-24 mb-4 relative flex items-center justify-center">
                                {/* Decorative shape behind logo */}
                                <div
                                    className="absolute inset-0 rotate-45 opacity-60 rounded-xl"
                                    style={{ backgroundColor: themeColor }}
                                ></div>
                                <div
                                    className="absolute inset-0 -rotate-12 opacity-60 rounded-xl"
                                    style={{ backgroundColor: themeColor, filter: 'brightness(0.8)' }}
                                ></div>

                                <div className="relative z-10 w-full h-full bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center border-2 border-slate-900">
                                    {card.avatar_url ? (
                                        <img src={card.avatar_url} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-slate-900">{card.name ? card.name[0] : 'V'}</span>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase drop-shadow-lg mb-1">
                                {card.name || "Your Name"}
                            </h1>
                            <p className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase" style={{ color: themeColor }}>
                                {card.profession || "Professional Title"}
                            </p>

                            <div className="absolute bottom-4 right-4 animate-bounce">
                                <span className="text-[10px] text-gray-500 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">Click to flip &rarr;</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. BACK SIDE */}
                    <div
                        className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row"
                        style={{
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 1
                        }}
                    >
                        {/* Left: Contact Info (Bottom on mobile, Left on Desktop) */}
                        <div className="w-full md:w-2/3 p-5 md:p-8 flex flex-col justify-center relative z-10 flex-1 overflow-y-auto md:overflow-visible">
                            <div className="mb-3 md:mb-6">
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-1 flex items-center gap-2">
                                    {card.company || "Your Company"}
                                    {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500 text-white" />}
                                </h1>
                                <p className="font-medium text-xs md:text-sm opacity-80 mb-2 md:mb-3" style={{ color: themeColor }}>{card.profession}</p>

                                {/* Rating Section */}
                                {showRating && (
                                    <div className="flex flex-col items-start mb-3 md:mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-700">{ratingStats?.average || '0.0'}</span>
                                            <span className="text-xs text-slate-400">({ratingStats?.count || 0})</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={(e) => { e.stopPropagation(); handleRate(star); }}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    disabled={userRating > 0}
                                                    className={`transition-transform hover:scale-110 focus:outline-none ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-300'}`}
                                                >
                                                    <Star
                                                        className="w-5 h-5 md:w-6 md:h-6"
                                                        fill={star <= (hoverRating || userRating) ? "currentColor" : "none"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                {card.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-slate-50" style={{ color: themeColor }}>
                                            <Phone className="w-3 h-3" />
                                        </div>
                                        <a href={`tel:${card.phone}`} className="text-xs md:text-sm text-slate-600 font-medium hover:underline truncate">{card.phone}</a>
                                    </div>
                                )}
                                {card.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-slate-50" style={{ color: themeColor }}>
                                            <Mail className="w-3 h-3" />
                                        </div>
                                        {/* REMOVED truncate, added break-all to fix cutting off */}
                                        <a href={`mailto:${card.email}`} className="text-xs md:text-sm text-slate-600 font-medium break-all hover:underline">{card.email}</a>
                                    </div>
                                )}
                                {card.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-slate-50" style={{ color: themeColor }}>
                                            <Globe className="w-3 h-3" />
                                        </div>
                                        <a href={card.website} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-slate-600 font-medium truncate hover:underline">{card.website.replace(/^https?:\/\//, '')}</a>
                                    </div>
                                )}

                                {(card.location || card.google_map_link) && (
                                    <a
                                        href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 hover:bg-slate-50 p-1 -ml-1 rounded transition-colors group cursor-pointer text-slate-800"
                                    >
                                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-slate-50 group-hover:bg-white" style={{ color: themeColor }}>
                                            <MapPin className="w-3 h-3" />
                                        </div>
                                        <span className="text-xs md:text-sm text-slate-600 font-medium truncate group-hover:underline">
                                            {card.location || "View on Map"}
                                        </span>
                                    </a>
                                )}
                            </div>

                            {/* Socials Row */}
                            <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
                                {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        style={{ '--hover-color': themeColor }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = themeColor; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <SocialIcon platform={platform} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right: Profile Image (Top on mobile, Right on Desktop) */}
                        <div
                            className="w-full h-32 md:h-auto md:w-1/3 relative overflow-hidden flex flex-col items-center justify-center p-2 shrink-0"
                            style={{ backgroundColor: themeColor }}
                        >
                            <div className="absolute inset-0" style={{ backgroundColor: '#000000', opacity: 0.1 }}></div>
                            <div className="absolute inset-0">
                                <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0 100 L100 0 L100 100 Z" fill="#000" />
                                </svg>
                            </div>

                            <div className="relative z-10 p-1.5 shadow-xl transform rotate-3">
                                <div className="border-2 border-slate-900 p-0.5 bg-white">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 flex items-center justify-center overflow-hidden">
                                        {card.avatar_url ? (
                                            <img src={card.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-slate-800">{card.name ? card.name[0] : 'V'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. ACTION BUTTONS - OUTSIDE of Flip Container */}
            <div className="absolute -right-3 top-0 bottom-0 flex flex-col justify-center gap-3 translate-x-full pointer-events-auto pl-4">
                <button
                    onClick={(e) => { e.stopPropagation(); handleLike && handleLike(e); }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isLiked ? 'text-white' : 'bg-white text-slate-400'}`}
                    style={isLiked ? { backgroundColor: themeColor } : {}}
                    onMouseEnter={(e) => !isLiked && (e.currentTarget.style.color = themeColor)}
                    onMouseLeave={(e) => !isLiked && (e.currentTarget.style.color = '#94a3b8')}
                    title="Like"
                >
                    <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleSave && handleSave(e); }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isSaved ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:text-slate-800'}`}
                    title="Save"
                >
                    <Bookmark className={`w-5 h-5 md:w-6 md:h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); /* Share logic */ }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg text-slate-400 hover:text-blue-500 transition-all active:scale-95"
                    title="Share"
                >
                    <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
        </div >
    );
};

export default RedGeometricCard;
