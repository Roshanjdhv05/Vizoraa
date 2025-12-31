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
    // Use optional chaining for cover_type (passed from preview) or regex for URL
    const isVideo = card.cover_type?.startsWith('video/') || card.cover_url?.match(/\.(mp4|webm|ogg)$/i);

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
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
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
                            {card.social_links?.whatsapp && <SocialIcon icon={WhatsAppIcon} url={card.social_links.whatsapp} isCustom={true} />}
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
const WhatsAppIcon = (props) => (
    <div className="bg-[#25D366] rounded-full p-1 flex items-center justify-center hover:scale-110 transition-transform">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            stroke="none"
            {...props}
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    </div>
);

const SocialIcon = ({ icon: Icon, url, isCustom = false }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`transition-all p-1 ${isCustom ? '' : 'text-slate-400 hover:text-slate-800 hover:scale-110'}`}
    >
        {isCustom ? <Icon /> : <Icon className="w-5 h-5" />}
    </a>
);

export default FlipCard;
