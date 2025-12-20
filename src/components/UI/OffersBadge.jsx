import React from 'react';
import { Flame } from 'lucide-react';

const OffersBadge = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={(e) => {
                if (onClick) {
                    e.stopPropagation();
                    onClick(e);
                }
            }}
            className={`inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-md animate-pulse hover:animate-none hover:scale-105 transition-transform ${className}`}
        >
            <Flame className="w-3 h-3 fill-white" />
            <span>Offer Available</span>
        </button>
    );
};

export default OffersBadge;
