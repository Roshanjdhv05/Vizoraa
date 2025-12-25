import React, { useState } from 'react';
import { Phone, Mail, Globe, MapPin, Instagram, Linkedin, Facebook, Twitter, Youtube } from 'lucide-react';

const FlipCard = ({ card, themeColor }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Business Card Aspect Ratio: 3.5in x 2in (Landscape) or 2in x 3.5in (Portrait)
    // User requested 2 x 3.5 inches (Portrait)
    // Using standard standard credit card ratio approx 0.63 or similar.
    // 2 / 3.5 = 0.57.
    // Let's set a fixed width/height or aspect-ratio class. 
    // Tailwind doesn't have default aspect-ratio for arbitrary values easily without plugins often.
    // I'll use inline styles for the container dimensions to enforce 2x3.5 ratio.
    // 300px width -> ~525px height.

    // Check if cover is video
    const isVideo = card.cover_url?.match(/\.(mp4|webm|ogg)$/i);

    return (
        <div
            className="relative perspective-1000 w-[300px] h-[525px] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Card Inner Container - Handles Rotation */}
            <div
                className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* --- FRONT SIDE (Media Only) --- */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {card.cover_url ? (
                        isVideo ? (
                            <video
                                src={card.cover_url}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                src={card.cover_url}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-6 text-center">
                            <span className="text-sm font-medium">Upload Image/Video</span>
                            <span className="text-xs opacity-70">Front Side</span>
                        </div>
                    )}

                    {/* Hint to flip */}
                    <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full pointer-events-none animate-pulse">
                        Tap to flip
                    </div>
                </div>

                {/* --- BACK SIDE (Details) --- */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden rotate-y-180 bg-white flex flex-col"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: card.theme_color || '#ffffff'
                    }}
                >
                    {/* Use a contrasting text color logic or simple white container overlay */}
                    <div className="relative w-full h-full bg-white/95 backdrop-blur-sm p-6 flex flex-col items-center text-center">

                        {/* Profile Image (Small, Centered) */}
                        <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 mt-8 shrink-0">
                            <img
                                src={card.avatar_url || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Name & Title & Company */}
                        <div className="mb-4 shrink-0">
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {card.name || 'Your Name'}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">
                                {card.profession || 'Profession'}
                            </p>
                            {card.company && (
                                <p className="text-xs font-semibold text-indigo-600 mt-1">
                                    {card.company}
                                </p>
                            )}
                        </div>

                        {/* Contact Details (Scrollable if needed, but fitting is requested) */}
                        <div className="w-full space-y-3 flex-1 overflow-y-auto custom-scrollbar text-sm text-left">

                            {/* About Section */}
                            {card.about && (
                                <div className="mb-4 text-center px-2">
                                    <p className="text-xs text-slate-600 italic leading-relaxed">
                                        "{card.about}"
                                    </p>
                                </div>
                            )}

                            {card.phone && (
                                <a href={`tel:${card.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-600 font-medium truncate">{card.phone}</span>
                                </a>
                            )}

                            {card.email && (
                                <a href={`mailto:${card.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-600 font-medium truncate">{card.email}</span>
                                </a>
                            )}

                            {card.website && (
                                <a href={card.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-600 font-medium truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}

                            {/* Location (Optional) */}
                            {card.location && (
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-600 font-medium truncate">{card.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Social Icons Footer */}
                        <div className="mt-4 pt-4 border-t border-slate-100 w-full flex justify-center gap-4 flex-wrap">
                            {card.social_links?.instagram && <SocialIcon icon={Instagram} url={card.social_links.instagram} />}
                            {card.social_links?.linkedin && <SocialIcon icon={Linkedin} url={card.social_links.linkedin} />}
                            {card.social_links?.twitter && <SocialIcon icon={Twitter} url={card.social_links.twitter} />}
                            {card.social_links?.facebook && <SocialIcon icon={Facebook} url={card.social_links.facebook} />}
                            {card.social_links?.youtube && <SocialIcon icon={Youtube} url={card.social_links.youtube} />}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

const SocialIcon = ({ icon: Icon, url }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} // Prevent flip on click
        className="text-slate-400 hover:text-slate-800 hover:scale-110 transition-all p-1"
    >
        <Icon className="w-5 h-5" />
    </a>
);

export default FlipCard;
