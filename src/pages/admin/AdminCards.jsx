import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Search, Trash2, Filter, MapPin, Briefcase } from 'lucide-react';

const AdminCards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [selectedProfession, setSelectedProfession] = useState('All');
    const [selectedState, setSelectedState] = useState('All');

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCards(data);
        } catch (error) {
            console.error('Error fetching cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (!window.confirm('Delete this card permanently?')) return;

        try {
            const { error } = await supabase.rpc('admin_delete_card', { target_card_id: cardId });
            if (error) throw error;
            setCards(cards.filter(c => c.id !== cardId));
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Failed to delete card. Ensure SQL functions are run.');
        }
    };

    // Derived Lists for Filters
    const professions = ['All', ...new Set(cards.map(c => c.profession).filter(Boolean))];
    const states = ['All', ...new Set(cards.map(c => c.state).filter(Boolean))];

    const filteredCards = cards.filter(card => {
        const matchesSearch = card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.profession?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProfession = selectedProfession === 'All' || card.profession === selectedProfession;
        const matchesState = selectedState === 'All' || card.state === selectedState;

        return matchesSearch && matchesProfession && matchesState;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Card Moderation</h2>
                    <p className="text-slate-500 text-sm">Filter and manage digital cards</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or job..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <select
                        value={selectedProfession}
                        onChange={(e) => setSelectedProfession(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none"
                    >
                        {professions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none"
                    >
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Cards Grid/List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-slate-400">Loading cards...</div>
                ) : filteredCards.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400">No cards matching filters.</div>
                ) : (
                    filteredCards.map(card => (
                        <div key={card.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-24 bg-slate-100 relative">
                                {card.banner_url && <img src={card.banner_url} className="w-full h-full object-cover" />}
                                <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-full border-2 border-white bg-white overflow-hidden shadow-sm">
                                    {card.avatar_url ? <img src={card.avatar_url} className="w-full h-full object-cover" /> : null}
                                </div>
                            </div>
                            <div className="pt-8 px-4 pb-4">
                                <h3 className="font-bold text-slate-900 truncate">{card.name}</h3>
                                <p className="text-xs text-slate-500 mb-2 truncate">{card.profession}</p>

                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{card.state || card.location || 'No Location'}</span>
                                </div>

                                <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                                    <a href={`/c/${card.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-medium hover:underline">
                                        View Live
                                    </a>
                                    <button
                                        onClick={() => handleDeleteCard(card.id)}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminCards;
