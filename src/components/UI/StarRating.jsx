import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ initialRating = 0, onRate, name = "Roshan" }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    // Sync local state if initialRating changes (e.g., from DB fetch)
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleRate = (star) => {
        setRating(star);
        if (onRate) onRate(star);
    };

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-sm flex flex-col items-center text-center">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Rate this Card</h3>
            <p className="text-slate-400 text-sm mb-6">How was your experience working with {name}?</p>

            <div className="flex gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="group relative focus:outline-none transition-transform duration-200 hover:scale-110"
                    >
                        <Star
                            className="w-10 h-10 transition-colors duration-200"
                            fill={(hover || rating) >= star ? '#FFC107' : 'transparent'}
                            stroke={(hover || rating) >= star ? '#FFC107' : '#CBD5E1'}
                            strokeWidth={1.5}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StarRating;
