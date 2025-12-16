import React, { useState } from 'react';
import { ChevronDown, MapPin, Briefcase } from 'lucide-react';

const CardFilter = ({ filters, setFilters, occupations }) => {
    // Static lists for demo purposes as requested
    const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Remote'];
    const countries = ['USA', 'Canada', 'UK', 'India', 'Australia', 'Germany'];

    const handleChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between w-full">
            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">

                {/* Occupation Dropdown */}
                <div className="relative group min-w-[200px] flex-1 xl:flex-none">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                        value={filters.occupation}
                        onChange={(e) => handleChange('occupation', e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-full bg-white border border-gray-200 text-slate-700 text-sm font-medium outline-none focus:border-[#7B4BFF] focus:ring-2 focus:ring-[#7B4BFF]/10 appearance-none cursor-pointer shadow-sm hover:border-[#7B4BFF]/50 transition-colors"
                    >
                        <option value="">Select Occupation</option>
                        {occupations.map(job => (
                            <option key={job} value={job}>{job}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Area Input */}
                <div className="relative flex-1 xl:flex-none min-w-[200px]">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={filters.area || ''}
                        onChange={(e) => handleChange('area', e.target.value)}
                        placeholder="Area or Locality"
                        className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-gray-200 text-slate-700 text-sm font-medium outline-none focus:border-[#7B4BFF] focus:ring-2 focus:ring-[#7B4BFF]/10 shadow-sm transition-all"
                    />
                </div>

                {/* State Dropdown */}
                <div className="relative group min-w-[160px] flex-1 xl:flex-none">
                    <select
                        value={filters.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-5 py-3 rounded-full bg-white border border-gray-200 text-slate-700 text-sm font-medium outline-none focus:border-[#7B4BFF] focus:ring-2 focus:ring-[#7B4BFF]/10 appearance-none cursor-pointer shadow-sm hover:border-[#7B4BFF]/50 transition-colors"
                    >
                        <option value="">Select State</option>
                        {states.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Country Dropdown */}
                <div className="relative group min-w-[160px] flex-1 xl:flex-none">
                    <select
                        value={filters.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full px-5 py-3 rounded-full bg-white border border-gray-200 text-slate-700 text-sm font-medium outline-none focus:border-[#7B4BFF] focus:ring-2 focus:ring-[#7B4BFF]/10 appearance-none cursor-pointer shadow-sm hover:border-[#7B4BFF]/50 transition-colors"
                    >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>

            </div>

            {/* Sorting Toggles */}
            <div className="flex items-center gap-2 mt-4 xl:mt-0">
                <button
                    onClick={() => handleChange('sort', 'likes')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filters.sort === 'likes'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-500 border-gray-200 hover:border-slate-300'
                        }`}
                >
                    Most Liked ❤️
                </button>
                <button
                    onClick={() => handleChange('sort', 'views')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filters.sort === 'views'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-500 border-gray-200 hover:border-slate-300'
                        }`}
                >
                    Most Viewed 👁️
                </button>
                <button
                    onClick={() => handleChange('sort', 'rating')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filters.sort === 'rating'
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                            : 'bg-white text-slate-500 border-gray-200 hover:border-slate-300'
                        }`}
                >
                    Top Rated ⭐
                </button>
            </div>
        </div>
    );
};

export default CardFilter;
