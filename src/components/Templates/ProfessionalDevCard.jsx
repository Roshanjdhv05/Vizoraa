import React, { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Share2, Heart, Bookmark, Star, Code, Terminal, Facebook, Instagram, Linkedin, Youtube, Cpu, Database } from 'lucide-react';

const SocialIcon = ({ platform }) => {
    switch (platform?.toLowerCase()) {
        case 'instagram': return <Instagram className="w-5 h-5 text-pink-400" />;
        case 'facebook': return <Facebook className="w-5 h-5 text-blue-400" />;
        case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-500" />;
        case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
        case 'twitter': return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-sky-400"><path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 9.66 9.66 0 0 0-4.17-6 19.3 19.3 0 0 0-6.15 1.7 15.42 15.42 0 0 1-11.2-5.7 6.16 6.16 0 0 0-.8 3.1 6.18 6.18 0 0 0 2.74 5.14 6.2 6.2 0 0 1-2.8-.78v.08a6.19 6.19 0 0 0 4.96 6.07 6.2 6.2 0 0 1-2.8.11 6.22 6.22 0 0 0 5.8 4.32 12.44 12.44 0 0 1-7.7 2.65 12.62 12.62 0 0 1-1.48-.09 17.58 17.58 0 0 0 9.53 2.8c11.43 0 17.68-9.5 17.68-17.76 0-.27 0-.54-.07-.81A12.7 12.7 0 0 0 22 5.8z" /></svg>;
        case 'website': return <Globe className="w-5 h-5 text-green-400" />;
        case 'whatsapp': return (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        );
        default: return <Globe className="w-5 h-5 text-gray-400" />;
    }
};

const ProfessionalDevCard = ({ card, isSaved, isLiked, userRating, handleLike, handleSave, handleRate, ratingStats, showRating = true }) => {
    const safeCard = card || {};
    const [isFlipped, setIsFlipped] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const skills = (safeCard.profession || "Full Stack Developer").split(/[,|]/).map(s => s.trim()).filter(Boolean);

    const handleFlip = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="group w-[90%] max-w-[320px] md:max-w-none md:w-[350px] h-[520px] md:h-[600px] cursor-pointer mx-auto"
            onClick={handleFlip}
            style={{ perspective: '1000px' }}
        >
            <div
                className={`relative w-full h-full transition-all duration-700`}
                style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* FRONT SIDE - IDE View */}
                <div
                    className="absolute w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-[#333] flex flex-col font-mono"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* IDE Header */}
                    <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-[#333] shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                            <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                        </div>
                        <div className="text-gray-400 text-xs flex items-center gap-2">
                            <Cpu className="w-3 h-3" />
                            <span>profile.tsx</span>
                        </div>
                    </div>

                    {/* IDE Body */}
                    <div className="flex-1 p-6 relative overflow-hidden flex flex-col">
                        {/* Line Numbers */}
                        <div className="absolute left-0 top-6 bottom-0 w-10 text-gray-600 text-right pr-3 select-none text-sm leading-6">
                            {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>

                        {/* Code */}
                        <div className="pl-6 pt-1 text-sm md:text-base leading-6 z-10 w-full">
                            <div className="text-[#c586c0]">import</div> <span className="text-[#9cdcfe]">{`{ Profile }`}</span> <div className="text-[#c586c0] inline">from</div> <span className="text-[#ce9178]">'@vizoraa/dev'</span>;
                            <div className="h-4"></div>

                            <div>
                                <span className="text-[#569cd6]">export const</span> <span className="text-[#dcdcaa]">Developer</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#ffd700]">{`{`}</span>
                            </div>

                            <div className="pl-4">
                                <span className="text-[#9cdcfe]">name</span>: <span className="text-[#ce9178]">"{safeCard.name}"</span>,
                            </div>

                            <div className="pl-4">
                                <span className="text-[#9cdcfe]">title</span>: <span className="text-[#ce9178]">"{skills[0] || 'Developer'}"</span>,
                            </div>

                            <div className="pl-4">
                                <span className="text-[#9cdcfe]">stack</span>: <span className="text-[#da70d6]">[</span>
                            </div>

                            <div className="pl-8 text-[#ce9178]">
                                {skills.slice(0, 4).map((skill, i) => (
                                    <div key={i}>"{skill}"{i < skills.length - 1 ? ',' : ''}</div>
                                ))}
                                {skills.length > 4 && <div className="text-gray-500">// ...more</div>}
                            </div>

                            <div className="pl-4">
                                <span className="text-[#da70d6]">]</span>,
                            </div>

                            <div className="pl-4">
                                <span className="text-[#9cdcfe]">status</span>: <span className="text-[#ce9178]">'Open to work'</span>
                            </div>

                            <div>
                                <span className="text-[#ffd700]">{`}`}</span>;
                            </div>
                        </div>

                        {/* Decorative Background Icon */}
                        <Code className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-[#ffffff] opacity-[0.03] rotate-[-12deg]" />
                    </div>

                    {/* Footer / Hint */}
                    <div className="py-2 bg-[#007acc] text-white text-xs text-center font-sans tracking-wide shrink-0">
                        WAITING FOR INPUT... (CLICK TO FLIP)
                    </div>
                </div>

                {/* BACK SIDE - Terminal View */}
                <div
                    className="absolute w-full h-full bg-[#0c0c0c] rounded-xl overflow-hidden shadow-2xl border border-[#333] flex flex-col"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {/* Terminal Header */}
                    <div className="h-10 bg-[#252526] flex items-center px-4 border-b border-[#333] shrink-0">
                        <Terminal className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-400 text-xs font-mono">bash -- vizoraa-cli</span>
                    </div>

                    {/* Terminal Content */}
                    <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
                        <div className="mb-4">
                            <span className="text-[#27c93f]">user@vizoraa</span>:<span className="text-[#3b82f6]">~</span>$ show contact --json
                        </div>

                        <div className="text-[#cccccc]">
                            <span className="text-[#ffd700]">{`{`}</span>

                            {safeCard.company && (
                                <div className="pl-4 my-1 truncate">
                                    <span className="text-[#9cdcfe]">"company"</span>: <span className="text-[#ce9178]">"{safeCard.company}"</span>,
                                </div>
                            )}

                            {safeCard.about && (
                                <div className="pl-4 my-1 break-words whitespace-pre-wrap">
                                    <span className="text-[#9cdcfe]">"bio"</span>: <span className="text-[#ce9178]">"{safeCard.about}"</span>,
                                </div>
                            )}

                            {safeCard.email && (
                                <div className="pl-4 my-1 truncate">
                                    <span className="text-[#9cdcfe]">"email"</span>: <a href={`mailto:${safeCard.email}`} className="text-[#ce9178] hover:underline underline-offset-4 decoration-[#ce9178]/50">"{safeCard.email}"</a>,
                                </div>
                            )}

                            {safeCard.phone && (
                                <div className="pl-4 my-1 truncate">
                                    <span className="text-[#9cdcfe]">"phone"</span>: <a href={`tel:${safeCard.phone}`} className="text-[#ce9178] hover:underline underline-offset-4 decoration-[#ce9178]/50">"{safeCard.phone}"</a>,
                                </div>
                            )}

                            {safeCard.website && (
                                <div className="pl-4 my-1 truncate">
                                    <span className="text-[#9cdcfe]">"web"</span>: <a href={safeCard.website} target="_blank" rel="noopener noreferrer" className="text-[#ce9178] hover:underline underline-offset-4 decoration-[#ce9178]/50">"{safeCard.website.replace(/^https?:\/\//, '')}"</a>,
                                </div>
                            )}

                            {safeCard.location && (
                                <div className="pl-4 my-1 truncate">
                                    <span className="text-[#9cdcfe]">"loc"</span>: <a href={safeCard.google_map_link} target="_blank" rel="noopener noreferrer" className="text-[#ce9178] hover:underline underline-offset-4 decoration-[#ce9178]/50">"{safeCard.location}"</a>,
                                </div>
                            )}

                            <div className="pl-4 my-1">
                                <span className="text-[#9cdcfe]">"socials"</span>: <span className="text-[#da70d6]">[</span>
                            </div>

                            <div className="pl-8 grid grid-cols-4 gap-2 my-2">
                                {safeCard.social_links && Object.entries(safeCard.social_links).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#1e1e1e] flex items-center justify-center rounded border border-[#333] hover:border-[#007acc] transition-colors"
                                        onClick={e => e.stopPropagation()}
                                        title={platform}
                                    >
                                        <SocialIcon platform={platform} />
                                    </a>
                                ))}
                            </div>

                            <div className="pl-4">
                                <span className="text-[#da70d6]">]</span>
                            </div>

                            <span className="text-[#ffd700]">{`}`}</span>
                        </div>

                        <div className="mt-4 mb-2">
                            <span className="text-[#27c93f]">user@vizoraa</span>:<span className="text-[#3b82f6]">~</span>$ <span className="animate-pulse">_</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 space-y-4">
                            {showRating && (
                                <div className="p-3 border border-[#333] rounded bg-[#1e1e1e]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500">RATING_MODULE</span>
                                        <span className="text-[#ffd700] font-bold text-xs">{ratingStats?.average || '0.0'} / 5.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={(e) => { e.stopPropagation(); handleRate(star); }}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                disabled={userRating > 0}
                                                className={`transition-colors ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-200'}`}
                                            >
                                                <Star className="w-5 h-5 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleSave(); }}
                                    className={`flex-1 py-3 text-xs font-bold border rounded flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-[#27c93f]/10 border-[#27c93f] text-[#27c93f]' : 'bg-[#1e1e1e] border-[#333] text-gray-400 hover:bg-[#252526]'}`}
                                >
                                    <Bookmark className="w-4 h-4" /> {isSaved ? 'SAVED' : 'SAVE'}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleLike(); }}
                                    className={`flex-1 py-3 text-xs font-bold border rounded flex items-center justify-center gap-2 transition-all ${isLiked ? 'bg-[#ff5f56]/10 border-[#ff5f56] text-[#ff5f56]' : 'bg-[#1e1e1e] border-[#333] text-gray-400 hover:bg-[#252526]'}`}
                                >
                                    <Heart className="w-4 h-4" /> {isLiked ? 'LIKED' : 'LIKE'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalDevCard;
