import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Eye, Link as LinkIcon, Image as ImageIcon, Loader2, Star, Repeat } from 'lucide-react';

const AdminAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [newAdLink, setNewAdLink] = useState('');
    const [newAdTitle, setNewAdTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImportant, setIsImportant] = useState(false);
    const [repeatInterval, setRepeatInterval] = useState(0);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
        if (!error) setAds(data || []);
        setLoading(false);
    };

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleCreateAd = async (e) => {
        e.preventDefault();
        if (!selectedImage) return alert('Please select an image');

        setUploading(true);
        try {
            // 1. Upload Image
            const fileExt = selectedImage.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `posters/${fileName}`;

            // We assume a bucket named 'ads' exists. If not, this fails.
            // Fallback: Use 'card-backgrounds' if 'ads' doesn't exist? No, stick to 'ads' and ask user to create it.
            const { error: uploadError } = await supabase.storage
                .from('ads')
                .upload(filePath, selectedImage);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('ads').getPublicUrl(filePath);

            // 3. Insert into Database
            const { data, error: insertError } = await supabase.from('ads').insert({
                image_url: publicUrl,
                link: newAdLink,
                title: newAdTitle,
                active: true,
                is_important: isImportant,
                repeat_interval: repeatInterval ? parseInt(repeatInterval) : 0
            }).select();

            if (insertError) throw insertError;

            // 4. Update UI
            setAds([data[0], ...ads]);
            setNewAdLink('');
            setNewAdTitle('');
            setIsImportant(false);
            setRepeatInterval(0);
            setSelectedImage(null);
            alert('Ad created successfully!');

        } catch (error) {
            console.error('Error creating ad:', error);
            alert('Failed to create ad. Ensure "ads" storage bucket exists and is public.');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAd = async (id) => {
        if (!window.confirm('Delete this ad?')) return;
        const { error } = await supabase.from('ads').delete().eq('id', id);
        if (!error) setAds(ads.filter(a => a.id !== id));
    };

    const toggleAdStatus = async (ad) => {
        const { error } = await supabase.from('ads').update({ active: !ad.active }).eq('id', ad.id);
        if (!error) {
            setAds(ads.map(a => a.id === ad.id ? { ...a, active: !a.active } : a));
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Advertisement Management</h2>
                <p className="text-slate-500 text-sm">Deploy ads to the home feed</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Ad Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> New Ad Campaign
                        </h3>
                        <form onSubmit={handleCreateAd} className="space-y-4">

                            {/* Image Upload Area */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {selectedImage ? (
                                    <div className="text-sm font-medium text-green-600 truncate">{selectedImage.name}</div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 py-4">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-sm">Click to upload poster</span>
                                        <span className="text-xs opacity-70">(Max 2MB)</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title (Optional)</label>
                                <input
                                    type="text"
                                    value={newAdTitle}
                                    onChange={e => setNewAdTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    placeholder="e.g. Summer Sale"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Target Link</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="url"
                                        value={newAdLink}
                                        onChange={e => setNewAdLink(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={isImportant}
                                            onChange={e => setIsImportant(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            High Importance <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        </div>
                                    </label>
                                </div>
                                {isImportant && (
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="number"
                                                min="1"
                                                value={repeatInterval}
                                                onChange={e => setRepeatInterval(e.target.value)}
                                                className="w-full pl-9 pr-3 py-3 border border-slate-200 rounded-lg text-sm"
                                                placeholder="Repeat after..."
                                                title="Repeat after every N ads"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Publish Ad'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Ads List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <p className="text-center text-slate-400 py-8">Loading campaigns...</p>
                    ) : ads.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-400 mb-2">No active advertisements</p>
                        </div>
                    ) : (
                        ads.map(ad => (
                            <div key={ad.id} className={`bg-white p-4 rounded-xl border ${ad.active ? 'border-slate-200' : 'border-slate-100 bg-slate-50 opacity-75'} flex gap-4 items-start`}>
                                <div className="w-24 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={ad.image_url} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                {ad.title || 'Untitled Ad'}
                                                {ad.is_important && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                                                        <Star className="w-2.5 h-2.5 fill-current" /> Important
                                                        {ad.repeat_interval > 0 && ` (Every ${ad.repeat_interval})`}
                                                    </span>
                                                )}
                                            </h4>
                                            <a href={ad.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-[200px]">{ad.link}</a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleAdStatus(ad)}
                                                className={`text-xs px-2 py-1 rounded-full font-bold border ${ad.active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                            >
                                                {ad.active ? 'Active' : 'Inactive'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAd(ad.id)}
                                                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-400">
                                        Created: {new Date(ad.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAds;
