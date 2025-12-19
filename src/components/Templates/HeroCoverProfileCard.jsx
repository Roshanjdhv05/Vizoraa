import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Share2, Star, BadgeCheck } from 'lucide-react';

const HeroCoverProfileCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
    const [hoverRating, setHoverRating] = useState(0);

    // Default Cover if none provided
    const defaultCover = "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop";
    const coverImage = card.cover_url || defaultCover;

    // Theme Color (Default to Orange if not set)
    const themeColor = card.theme_color || '#f97316';

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
        <div className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col font-sans">

            {/* 2. Top Cover Image (Hero Section) */}
            <div className="relative h-48 w-full">
                <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>

                {/* Wave/Curved bottom edge effect using SVG */}
                <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#ffffff' }}></path>
                    </svg>
                </div>
            </div>

            {/* 3. Profile Avatar (Overlapping) */}
            <div className="relative -mt-16 flex justify-center z-10">
                <div className="w-24 h-24 rounded-full p-1 bg-white shadow-lg">
                    {card.avatar_url ? (
                        <img
                            src={card.avatar_url}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover bg-slate-100"
                        />
                    ) : (
                        <div
                            className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold"
                            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                        >
                            {card.name ? card.name[0] : 'U'}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. User Identity Section */}
            <div className="text-center mt-3 px-6 mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-1 leading-tight flex items-center justify-center gap-2">
                    {card.name}
                    {isVerified && <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500 text-white" />}
                </h1>
                <p className="text-slate-500 font-medium mb-1">{card.profession}</p>
                <p className="text-slate-400 text-sm">{card.company}</p>
            </div>

            {/* Rating Section (Existing Feature Support) */}
            {showRating && (
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="flex items-center gap-1 mb-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${themeColor}15` }}>
                        <span className="font-bold text-slate-800">{ratingStats?.average || '0.0'}</span>
                        <span className="text-xs opacity-70" style={{ color: themeColor }}>({ratingStats?.count || 0})</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                disabled={userRating > 0}
                                className={`transition-transform hover:scale-110 focus:outline-none`}
                                style={{ color: star <= (hoverRating || userRating) ? themeColor : '#fed7aa' }}
                            >
                                <Star
                                    className="w-5 h-5"
                                    fill={star <= (hoverRating || userRating) ? "currentColor" : "none"}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* About Section */}
            {card.about && (
                <div className="px-8 mb-6 text-center w-full">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium break-words whitespace-pre-wrap">
                        {card.about}
                    </p>
                </div>
            )}

            {/* 5. Primary Action Buttons */}
            <div className="flex flex-col items-center gap-4 mb-8">
                {card.email && (
                    <a
                        href={`mailto:${card.email}`}
                        className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                        style={{ backgroundColor: themeColor, shadowColor: `${themeColor}40` }}
                    >
                        <Mail className="w-6 h-6" />
                    </a>
                )}
                {card.phone && (
                    <a
                        href={`tel:${card.phone}`}
                        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 hover:scale-110 active:scale-95 transition-all animate-pulse-slow"
                    >
                        <Phone className="w-7 h-7 fill-current" />
                    </a>
                )}
            </div>

            {/* Social Links */}
            {/* Social Links including Website */}
            {(card.social_links || card.website) && (
                <div className="flex justify-center flex-wrap gap-4 px-8 mb-8">
                    {/* Website Icon */}
                    {card.website && (
                        <a
                            href={card.website}
                            target="_blank"
                            className="text-slate-400 transition-colors"
                            style={{ ':hover': { color: themeColor } }}
                            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                            title="Website"
                        >
                            <SocialIcon platform="website" />
                        </a>
                    )}

                    {/* Other Socials */}
                    {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                        <a
                            key={platform}
                            href={url}
                            target="_blank"
                            className="text-slate-400 transition-colors"
                            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >
                            <SocialIcon platform={platform} />
                        </a>
                    ))}
                </div>
            )}

            {(card.location || card.google_map_link) && (
                <div className="flex justify-center mb-6">
                    <a
                        href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                        target="_blank"
                        className="flex items-center gap-1 text-xs text-slate-400"
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                    >
                        <MapPin className="w-3 h-3" />
                        {card.location || "View Location"}
                    </a>
                </div>
            )}

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* 6. Footer Section */}
            <div
                className="py-4 text-center mt-auto transition-colors duration-300"
                style={{ backgroundColor: themeColor }}
            >
                <p className="text-white/90 text-sm font-medium">Tap icons to connect</p>
                <div className="flex justify-center gap-4 mt-3">
                    <button onClick={handleLike} className={`text-white/80 hover:text-white flex items-center gap-1 text-xs ${isLiked ? 'font-bold text-white' : ''}`}>
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> {card.like_count || 'Like'}
                    </button>
                    <button onClick={handleSave} className={`text-white/80 hover:text-white flex items-center gap-1 text-xs ${isSaved ? 'font-bold text-white' : ''}`}>
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HeroCoverProfileCard;
