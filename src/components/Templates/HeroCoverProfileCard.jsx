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

            {/* Social Links including Website & Location */}
            <div className="flex justify-center flex-wrap gap-5 px-6 mb-8">
                {/* Website Icon */}
                {card.website && (
                    <a
                        href={card.website}
                        target="_blank"
                        className="transition-transform hover:scale-110"
                        title="Website"
                    >
                        <div className="bg-slate-100 p-3 rounded-full text-slate-700 hover:bg-slate-200 shadow-sm">
                            <Globe className="w-6 h-6" />
                        </div>
                    </a>
                )}

                {/* Socials */}
                {card.social_links && Object.entries(card.social_links).map(([platform, url]) => {
                    if (!url) return null;
                    let icon = <Globe className="w-6 h-6" />;
                    let bgClass = "bg-slate-100 text-slate-700";

                    switch (platform.toLowerCase()) {
                        case 'instagram':
                            icon = <Instagram className="w-6 h-6" />;
                            bgClass = "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white";
                            break;
                        case 'facebook':
                            icon = <Facebook className="w-6 h-6" />;
                            bgClass = "bg-[#1877F2] text-white";
                            break;
                        case 'linkedin':
                            icon = <Linkedin className="w-6 h-6" />;
                            bgClass = "bg-[#0A66C2] text-white";
                            break;
                        case 'twitter':
                            icon = <Twitter className="w-6 h-6" />;
                            bgClass = "bg-black text-white"; // X branding
                            break;
                        case 'youtube':
                            icon = <Youtube className="w-6 h-6" />;
                            bgClass = "bg-[#FF0000] text-white";
                            break;
                        case 'whatsapp':
                            icon = <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
                            bgClass = "bg-[#25D366] text-white";
                            break;
                        default:
                            break;
                    }

                    return (
                        <a
                            key={platform}
                            href={url}
                            target="_blank"
                            className="transition-transform hover:scale-110 shadow-sm rounded-full"
                        >
                            <div className={`p-3 rounded-full ${bgClass} shadow-md`}>
                                {icon}
                            </div>
                        </a>
                    );
                })}

                {/* Map / Location Icon */}
                {(card.location || card.google_map_link) && (
                    <a
                        href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                        target="_blank"
                        className="transition-transform hover:scale-110"
                        title={card.location || "View Location"}
                    >
                        <div className="bg-green-500 p-3 rounded-full text-white shadow-md hover:bg-green-600">
                            <MapPin className="w-6 h-6" />
                        </div>
                    </a>
                )}
            </div>

            {/* Location Address Text (Restored) */}
            {card.location && (
                <div className="flex justify-center mb-6 -mt-4 px-6">
                    <p className="text-slate-500 text-sm font-medium text-center flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {card.location}
                    </p>
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
