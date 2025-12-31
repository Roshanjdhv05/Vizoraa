import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube, Heart, Bookmark, Star, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            case 'whatsapp': return (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            );
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

            {/* Company & Offer Badge */}
            <div className="flex items-center justify-center gap-2 mb-1">
                {card.company && <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">{card.company}</span>}
                {card.has_active_offer && (
                    <Link
                        to={`/offers?user_id=${card.user_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-red-500 underline hover:text-red-600 animate-pulse"
                    >
                        offer
                    </Link>
                )}
            </div>

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

            {/* About Section */}
            {card.about && (
                <div className="w-full px-4 mb-6 text-center">
                    <p className="text-slate-600 text-sm font-light leading-relaxed break-words whitespace-pre-wrap">{card.about}</p>
                </div>
            )}

            <div className="w-full space-y-4 mb-8">
                {card.phone && <a href={`tel:${card.phone}`} className="block py-3 border-b border-gray-100 text-slate-600 hover:text-black transition-colors">{card.phone}</a>}
                {card.email && <a href={`mailto:${card.email}`} className="block py-3 border-b border-gray-100 text-slate-600 hover:text-black transition-colors">{card.email}</a>}

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
                {card.website && (
                    <a href={card.website} target="_blank" className="text-slate-400 hover:text-black transition-colors">
                        <Globe className="w-5 h-5" />
                    </a>
                )}
                {card.social_links && Object.entries(card.social_links).map(([platform, url]) => (
                    <a key={platform} href={url} target="_blank" className={`text-slate-400 hover:text-black transition-colors rounded-full p-1 ${platform.toLowerCase() === 'whatsapp' ? 'text-[#25D366] hover:text-[#25D366]' : ''}`}>
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
