import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

const MobileFilterSheet = ({ isOpen, onClose, filters, onApply, occupations = [], allStates = [], allCountries = [] }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [occupationSearch, setOccupationSearch] = useState('');
    const [animate, setAnimate] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setLocalFilters(filters);
            setOccupationSearch(''); // Reset local search on open
            setTimeout(() => setAnimate(true), 10);
            document.body.style.overflow = 'hidden';
            if (contentRef.current) {
                contentRef.current.scrollTop = 0;
            }
        } else {
            setAnimate(false);
            document.body.style.overflow = 'unset';
            // Slight delay to allow animation to finish before unmounting if we were controlling render
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, filters]);

    if (!isOpen) return null;

    const handleCategoryToggle = (cat) => {
        setLocalFilters(prev => {
            const exists = prev.occupation.includes(cat);
            return {
                ...prev,
                occupation: exists
                    ? prev.occupation.filter(c => c !== cat)
                    : [...prev.occupation, cat]
            };
        });
    };

    const handleSortSelect = (sortVal) => {
        setLocalFilters(prev => ({ ...prev, sort: sortVal }));
    };

    const filteredOccupations = occupations.filter(occ =>
        occ.toLowerCase().includes(occupationSearch.toLowerCase())
    );

    const Chip = ({ label, selected, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 rounded-[14px] text-sm font-medium border transition-all duration-200 active:scale-95 ${selected
                ? 'bg-[#FFE5DF] text-[#E86A4F] border-[#FFB7A8] shadow-sm'
                : 'bg-white text-[#1C1C1C] border-[#E3E3E3] hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );

    const SortChip = ({ label, selected, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full py-3 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-95 flex items-center justify-center ${selected
                ? 'bg-[#7B4BFF] text-white border-[#7B4BFF] shadow-md shadow-purple-200'
                : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
        >
            {label}
        </button>
    );

    const Dropdown = ({ label, options, value, onChange, placeholder = "Select..." }) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-semibold text-[#1C1C1C] mb-2">{label}</label>
                <div className="relative">
                    <select
                        value={Array.isArray(value) ? value[0] || '' : value}
                        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
                        className="w-full appearance-none bg-white border border-[#E3E3E3] rounded-xl px-4 py-3.5 text-[#1C1C1C] focus:outline-none focus:border-[#7B4BFF] transition-colors"
                    >
                        <option value="">{placeholder}</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        );
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`relative bg-[#FFFFFF] w-full rounded-t-[30px] shadow-2xl flex flex-col h-[85vh] transition-transform duration-300 ease-out transform ${animate ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Drag Indicator */}
                <div className="w-full flex justify-center pt-3 pb-2" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="text-center pb-4 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-[#1C1C1C]">Search Filter</h2>
                </div>

                {/* Content - Scrollable */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar pb-32"
                >

                    {/* 1. Category with Search */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">Category</h3>

                        {/* Search Input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={occupationSearch}
                                onChange={(e) => setOccupationSearch(e.target.value)}
                                placeholder="Search criteria..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B4BFF] focus:bg-white transition-all"
                            />
                        </div>

                        {/* Chips Grid */}
                        <div className="flex flex-wrap gap-2.5 max-h-[200px] overflow-y-auto custom-scrollbar content-start">
                            {filteredOccupations.length > 0 ? (
                                filteredOccupations.map(job => (
                                    <Chip
                                        key={job}
                                        label={job}
                                        selected={localFilters.occupation.includes(job)}
                                        onClick={() => handleCategoryToggle(job)}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic w-full text-center py-2">No categories found</p>
                            )}
                        </div>
                    </div>

                    {/* 2. Area */}
                    <div>
                        <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Area</label>
                        <input
                            type="text"
                            value={localFilters.area}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, area: e.target.value }))}
                            placeholder="Enter area or locality..."
                            className="w-full bg-white border border-[#E3E3E3] rounded-xl px-4 py-3.5 text-[#1C1C1C] placeholder:text-gray-400 focus:outline-none focus:border-[#7B4BFF] transition-all"
                        />
                    </div>

                    {/* 3. State & 4. Country */}
                    <Dropdown
                        label="State"
                        options={allStates}
                        value={localFilters.state}
                        onChange={(val) => setLocalFilters(prev => ({ ...prev, state: val }))}
                    />
                    <Dropdown
                        label="Country"
                        options={allCountries}
                        value={localFilters.country}
                        onChange={(val) => setLocalFilters(prev => ({ ...prev, country: val }))}
                    />

                    {/* 5. Sort Options - Grid Layout */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">Sort By</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Oldest', val: 'oldest' },
                                { label: 'Most Liked', val: 'likes' },
                                { label: 'Most Viewed', val: 'views' },
                                { label: 'Top Rated', val: 'rating' },
                                { label: 'Newest', val: 'newest' }
                            ].map(opt => (
                                <SortChip
                                    key={opt.val}
                                    label={opt.label}
                                    selected={localFilters.sort === opt.val}
                                    onClick={() => handleSortSelect(opt.val)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons (Absolute Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-3 rounded-t-[20px] shadow-[0_-5px_30px_rgba(0,0,0,0.03)] pb-8 safe-area-bottom z-10">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-[12px] bg-white border border-gray-200 text-slate-600 font-semibold text-base hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onApply(localFilters); onClose(); }}
                        className="flex-1 py-3 rounded-[12px] bg-[#FFB7A8] text-[#1C1C1C] font-bold text-base hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-orange-100"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MobileFilterSheet;
