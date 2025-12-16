import React from 'react';
import { ExternalLink } from 'lucide-react';

const AdCard = ({ ad }) => {
    return (
        <div className="w-full bg-slate-900 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-shadow relative aspect-[3/4] group border border-slate-800">
            <img
                src={ad.image_url}
                alt={ad.title || 'Advertisement'}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />

            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                Sponsored
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                {ad.title && <h3 className="text-white font-bold text-lg mb-1">{ad.title}</h3>}
                {ad.link && (
                    <a
                        href={ad.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-full text-sm font-bold w-full justify-center transition-colors"
                    >
                        Learn More <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default AdCard;
