import React, { useState } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const CreateOfferModal = ({ onClose, onSuccess, userId }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        show_on_card: true,
        show_on_home: false
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
            .from('offer-images')
            .upload(fileName, imageFile);

        if (error) throw error;

        const { data } = supabase.storage.from('offer-images').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Image is now optional


        setLoading(true);
        try {
            const imageUrl = await uploadImage();

            const { error } = await supabase.from('offers').insert({
                user_id: userId,
                title: formData.title,
                description: formData.description,
                image_url: imageUrl || '',
                show_on_card: formData.show_on_card,
                show_on_home: formData.show_on_home
            });

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Failed to post offer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Post New Offer</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Offer Image (Optional)</label>
                        <div
                            className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer overflow-hidden ${imagePreview ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                                }`}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Change Image</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Click to upload image</p>
                                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Offer Title (Optional)</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="e.g. 50% Off Summer Sale"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <span className={`text-xs ${formData.description.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                                {formData.description.length}/500
                            </span>
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            maxLength={500}
                            rows={4}
                            className="input-field w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            placeholder="Describe your offer details..."
                            required
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.show_on_card}
                                onChange={(e) => setFormData({ ...formData, show_on_card: e.target.checked })}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">Show offer on my digital card</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.show_on_home}
                                onChange={(e) => setFormData({ ...formData, show_on_home: e.target.checked })}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">Show &quot;Offer Badge&quot; on Home Page card</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            'Post Offer'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOfferModal;
