import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, MapPin, Briefcase, Globe, Check, SlidersHorizontal } from 'lucide-react';
import MobileFilterSheet from './MobileFilterSheet';

const MultiSelectDropdown = ({ label, icon: Icon, options, selected, onChange, searchable = true, placeholder = "Search..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isOpen || selected.length > 0 ? 'border-[#7B4BFF] bg-[#7B4BFF]/5 text-[#7B4BFF]' : 'border-gray-200 hover:border-gray-300 text-slate-600'} bg-white text-sm font-medium min-w-[160px] justify-between`}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{selected.length > 0 ? `${label} (${selected.length})` : label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-[60] max-h-[400px] flex flex-col">
                    {searchable && (
                        <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-transparent outline-none text-sm text-slate-700"
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => toggleOption(option)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-slate-700 flex items-center justify-between group"
                                >
                                    <span>{option}</span>
                                    {selected.includes(option) && <Check className="w-4 h-4 text-[#7B4BFF]" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-xs">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const AdvancedSearchFilter = ({ filters, setFilters, onSearch, occupations = [], showFilters = true, placeholder = "Search by name, service, or keyword..." }) => {
    // Mock Data for demo - effectively "Searchable Dropdowns"
    const allStates = ["California", "New York", "Texas", "Florida", "Illinois", "Washington", "Maharashtra", "Karnataka", "Delhi", "London", "Bavaria"];
    const allCountries = ["USA", "India", "UK", "Canada", "Germany", "Australia", "UAE", "Singapore"];

    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

    // Sort Options
    const sortOptions = [
        { label: "Most Liked", value: "likes" },
        { label: "Most Viewed", value: "views" },
        { label: "Top Rated", value: "rating" },
        { label: "Newest", value: "newest" }
    ];

    const removeFilter = (key, value) => {
        if (Array.isArray(filters[key])) {
            setFilters(prev => ({ ...prev, [key]: prev[key].filter(item => item !== value) }));
        } else {
            setFilters(prev => ({ ...prev, [key]: '' }));
        }
    };

    const clearAll = () => {
        setFilters({
            search: '',
            occupation: [],
            area: '',
            state: [],
            country: [],
            sort: 'newest'
        });
    };

    const handleMobileApply = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // Trigger search logic if handled by effect in parent, or we can explicit call
        if (onSearch) setTimeout(onSearch, 100);
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 px-4 md:px-0">
            {/* 1. Search Bar Section (Large, Behance-style) */}
            <div className="relative w-full z-40">
                <div className="relative group transition-all duration-300 focus-within:-translate-y-1">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Search className="w-6 h-6" />
                    </div>

                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full pl-16 pr-28 lg:pr-32 py-5 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 outline-none text-slate-700 text-lg font-medium placeholder:text-slate-400 focus:shadow-[0_8px_30px_rgba(123,75,255,0.15)] focus:border-[#7B4BFF]/20 transition-all hover:border-gray-200"
                    />

                    {/* Desktop Search Button */}
                    <button
                        onClick={onSearch}
                        className="hidden lg:flex absolute right-2 top-2 bottom-2 bg-[#7B4BFF] hover:bg-[#6835de] text-white px-8 rounded-full font-bold text-sm shadow-md items-center justify-center transition-all active:scale-95"
                    >
                        Search
                    </button>

                    {/* Mobile Search Button (New) */}
                    <button
                        onClick={onSearch}
                        className="lg:hidden absolute right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#7B4BFF] text-white shadow-md active:scale-90 transition-all hover:bg-[#6835de]"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Mobile Filter Trigger (Inside Bar) */}
                    {showFilters && (
                        <button
                            onClick={() => setIsMobileSheetOpen(true)}
                            className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-50 text-slate-600 hover:bg-gray-100 hover:text-[#7B4BFF] transition-all active:scale-90"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Desktop Filters Section (Below Search) */}
            {showFilters && (
                <div
                    className={`hidden lg:flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-forwards`}
                >
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                        <MultiSelectDropdown
                            label="Occupation"
                            icon={Briefcase}
                            options={occupations}
                            selected={filters.occupation}
                            onChange={(val) => setFilters(prev => ({ ...prev, occupation: val }))}
                        />

                        <div className="relative group min-w-[180px]">
                            <div className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors text-sm font-medium shadow-sm hover:shadow-md">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={filters.area}
                                    onChange={(e) => setFilters(prev => ({ ...prev, area: e.target.value }))}
                                    placeholder="Area"
                                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <MultiSelectDropdown
                            label="State"
                            icon={MapPin}
                            options={allStates}
                            selected={filters.state}
                            onChange={(val) => setFilters(prev => ({ ...prev, state: val }))}
                        />

                        <MultiSelectDropdown
                            label="Country"
                            icon={Globe}
                            options={allCountries}
                            selected={filters.country}
                            onChange={(val) => setFilters(prev => ({ ...prev, country: val }))}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative min-w-[160px]">
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                            className="w-full appearance-none flex items-center gap-2 px-5 py-3.5 pr-12 rounded-xl border border-gray-200 bg-white text-sm font-medium text-slate-600 outline-none focus:border-[#7B4BFF] hover:border-gray-300 hover:shadow-md transition-all cursor-pointer shadow-sm"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Active Pills Section */}
            {showFilters && (filters.occupation.length > 0 || filters.state.length > 0 || filters.country.length > 0 || filters.area || filters.sort !== 'newest') && (
                <div className="flex flex-wrap items-center gap-3 animate-fadeIn px-2 lg:px-0">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Filters:</span>

                    {filters.occupation.map(job => (
                        <button key={job} onClick={() => removeFilter('occupation', job)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors">
                            {job}
                            <X className="w-3 h-3" />
                        </button>
                    ))}

                    {filters.area && (
                        <button onClick={() => setFilters(prev => ({ ...prev, area: '' }))} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors">
                            Area: {filters.area}
                            <X className="w-3 h-3" />
                        </button>
                    )}

                    {filters.state.map(s => (
                        <button key={s} onClick={() => removeFilter('state', s)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors">
                            {s}
                            <X className="w-3 h-3" />
                        </button>
                    ))}

                    {filters.country.map(c => (
                        <button key={c} onClick={() => removeFilter('country', c)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors">
                            {c}
                            <X className="w-3 h-3" />
                        </button>
                    ))}

                    {filters.sort !== 'newest' && (
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-[#7B4BFF] text-xs font-bold border border-purple-100">
                            Sorted by: {sortOptions.find(o => o.value === filters.sort)?.label}
                        </span>
                    )}

                    <button
                        onClick={clearAll}
                        className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline ml-2"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
                isOpen={isMobileSheetOpen}
                onClose={() => setIsMobileSheetOpen(false)}
                filters={filters}
                onApply={handleMobileApply}
                occupations={occupations}
                allStates={allStates}
                allCountries={allCountries}
            />
        </div>
    );
};

export default AdvancedSearchFilter;
