import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Star, BadgeCheck } from 'lucide-react';

const GlassmorphismCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true, isVerified }) => {
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
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col items-center p-6 text-white"
            style={{ background: 'linear-gradient(45deg, #FC466B, #3F5EFB)' }}>

            {/* Glass Container */}
            <div className="w-full h-full bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 flex flex-col items-center p-6">

                <div className="w-24 h-24 rounded-full border-4 border-white/40 shadow-lg mb-4">
                    {card.avatar_url ? (
                        <img src={card.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-bold">{card.name[0]}</div>
                    )}
                </div>

                <h1 className="text-2xl font-bold mb-1 shadow-black flex items-center justify-center gap-2">
                    {card.name}
                    {isVerified && <BadgeCheck className="w-6 h-6 text-white fill-blue-500" />}
                </h1>
                <p className="text-white/80 font-medium mb-6 uppercase tracking-wider text-sm">{card.profession}</p>

                {/* Rating Section */}
                {showRating && (
                    <div className="flex flex-col items-center bg-white/5 rounded-xl p-3 mb-6 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-white mb-2">
                            <span className="font-bold">{ratingStats?.average || '0.0'}</span>
                            <span className="text-xs text-white/60">({ratingStats?.count || 0})</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    disabled={userRating > 0}
                                    className={`hover:scale-110 transition-transform ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-white/20 hover:text-yellow-300'}`}
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

                {/* About Section */}
                {card.about && (
                    <div className="mb-6 text-center w-full">
                        <p className="text-white/90 text-sm font-light italic break-words whitespace-pre-wrap">"{card.about}"</p>
                    </div>
                )}

                <div className="w-full space-y-3 mb-6">
                    {card.phone && (
                        <a href={`tel:${card.phone} `} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                            <Phone className="w-5 h-5" />
                            <span className="text-sm">{card.phone}</span>
                        </a>
                    )}
                    {card.email && (
                        <a href={`mailto:${card.email} `} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                            <Mail className="w-5 h-5" />
                            <span className="text-sm truncate">{card.email}</span>
                        </a>
                    )}

                    {(card.location || card.google_map_link) && (
                        <a
                            href={card.google_map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.location || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-xl transition-colors hover:bg-white/20 cursor-pointer"
                        >
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm">{card.location || "View Location"}</span>
                        </a >
                    )}
                </div >

                <div className="flex gap-4 mt-auto mb-6">
                    {card.website && (
                        <a href={card.website} target="_blank" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-indigo-600 transition-all">
                            <Globe className="w-5 h-5" />
                        </a>
                    )}
                    {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-indigo-600 transition-all">
                            <SocialIcon platform={platform} />
                        </a>
                    ))}
                </div>

                <div className="flex w-full gap-2">
                    <button onClick={handleLike} className={`flex-1 py-2 rounded-lg font-bold transition-all ${isLiked ? 'bg-pink-500' : 'bg-white/10 hover:bg-white/20'}`}>
                        Like
                    </button>
                    <button onClick={handleSave} className={`flex-1 py-2 rounded-lg font-bold transition-all ${isSaved ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}>
                        Save
                    </button>
                </div>

            </div >
        </div >
    );
};

export default GlassmorphismCard;
