import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CreditCard, Save, Loader2, Link as LinkIcon, Camera, Upload, MapPin } from 'lucide-react';

import ModernCard from '../components/Templates/ModernCard';
import ConferenceGradientCard from '../components/Templates/ConferenceGradientCard';
import MinimalistCard from '../components/Templates/MinimalistCard';
import GlassmorphismCard from '../components/Templates/GlassmorphismCard';
import RedGeometricCard from '../components/Templates/RedGeometricCard';

const EditCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [formData, setFormData] = useState({
        title: 'My Business Card',
        name: '',
        profession: '',
        company: '',
        phone: '',
        email: '',
        website: '',
        location: '',
        google_map_link: '',
        theme_color: '#6366f1',
        template_id: 'modern',
        social_links: {
            instagram: '',
            linkedin: '',
            facebook: '',
            twitter: '',
            youtube: ''
        }
    });

    useEffect(() => {
        fetchCard();
    }, [id]);

    const fetchCard = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id) // Ensure ownership
                .single();

            if (error) throw error;

            // Populate form
            setFormData({
                title: data.title || 'My Business Card',
                name: data.name || '',
                profession: data.profession || '',
                company: data.company || '',
                phone: data.phone || '',
                email: data.email || '',
                website: data.website || '',
                location: data.location || '',
                google_map_link: data.google_map_link || '',
                theme_color: data.theme_color || '#6366f1',
                template_id: data.template_id || 'modern',
                social_links: {
                    instagram: extractUsername(data.social_links?.instagram),
                    linkedin: extractUsername(data.social_links?.linkedin),
                    facebook: extractUsername(data.social_links?.facebook),
                    twitter: extractUsername(data.social_links?.twitter),
                    youtube: extractUsername(data.social_links?.youtube),
                }
            });
            if (data.avatar_url) setAvatarUrl(data.avatar_url);

        } catch (error) {
            console.error('Error fetching card:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // Helper to extract username from URL
    const extractUsername = (url) => {
        if (!url) return '';
        try {
            // If it's already just a username (no http), return it
            if (!url.startsWith('http')) return url;

            const urlObj = new URL(url);
            const path = urlObj.pathname.replace(/^\/|\/$/g, ''); // Trim slashes

            // Handle specific platforms if needed, but usually last segment works
            // LinkedIn: linkedin.com/in/username
            // YouTube: youtube.com/@username
            if (url.includes('linkedin.com/in/')) return path.split('in/')[1] || path;
            if (url.includes('youtube.com/@')) return path.split('@')[1] || path;

            return path.split('/').pop();
        } catch (e) {
            return url;
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e) => {
        setFormData({
            ...formData,
            social_links: { ...formData.social_links, [e.target.name]: e.target.value }
        });
    };

    const handleImageSelect = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setAvatarFile(file);
        setAvatarUrl(URL.createObjectURL(file)); // Preview
    };

    const uploadAvatar = async (userId) => {
        if (!avatarFile) return null;

        try {
            setUploading(true);
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const formatSocialUrl = (platform, username) => {
        if (!username) return '';
        if (username.startsWith('http')) return username;
        username = username.replace('@', '');

        switch (platform) {
            case 'instagram': return `https://instagram.com/${username}`;
            case 'linkedin': return `https://linkedin.com/in/${username}`;
            case 'facebook': return `https://facebook.com/${username}`;
            case 'twitter': return `https://twitter.com/${username}`;
            case 'youtube': return `https://youtube.com/@${username}`;
            default: return username;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for Google Map Link
        if (formData.google_map_link && !formData.google_map_link.startsWith('http')) {
            alert('Please enter a valid Google Maps link (e.g., https://maps.app.goo.gl/...)');
            return;
        }

        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            let finalAvatarUrl = avatarUrl;
            if (avatarFile) {
                const uploadedUrl = await uploadAvatar(user.id);
                if (uploadedUrl) finalAvatarUrl = uploadedUrl;
            }

            const processedSocials = {};
            Object.entries(formData.social_links).forEach(([key, value]) => {
                const url = formatSocialUrl(key, value);
                if (url) processedSocials[key] = url;
            });

            const { error } = await supabase
                .from('cards')
                .update({
                    ...formData,
                    avatar_url: finalAvatarUrl,
                    social_links: processedSocials
                })
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) throw error;
            navigate('/dashboard');

        } catch (error) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;

    // Prepare preview data
    const previewCard = {
        ...formData,
        avatar_url: avatarUrl,
        social_links: Object.keys(formData.social_links).reduce((acc, key) => {
            const username = formData.social_links[key];
            if (username) acc[key] = formatSocialUrl(key, username);
            return acc;
        }, {})
    };

    const renderPreview = () => {
        const props = {
            card: previewCard,
            isSaved: false,
            isLiked: false,
            handleLike: (e) => e.preventDefault(),
            handleSave: (e) => e.preventDefault()
        };

        switch (formData.template_id) {
            case 'conference-gradient': return <ConferenceGradientCard {...props} />;
            case 'minimalist': return <MinimalistCard {...props} />;
            case 'glassmorphism': return <GlassmorphismCard {...props} />;
            case 'red-geometric': return <RedGeometricCard {...props} />;
            case 'modern': default: return <ModernCard {...props} />;
        }
    };

    return (
        <div className="container max-w-7xl py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Edit Digital Card</h1>
                                <p className="text-slate-500">Update your card details</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Template Selection moved to top */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800">Choose Template</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {[
                                        { id: 'modern', name: 'Modern', color: '#6366f1' },
                                        { id: 'conference-gradient', name: 'Conference', color: '#EEDBFF' },
                                        { id: 'minimalist', name: 'Minimalist', color: '#ffffff', border: true },
                                        { id: 'glassmorphism', name: 'Glass', color: '#FC466B' },
                                        { id: 'red-geometric', name: 'Geometric', color: '#EF4444' }
                                    ].map(template => (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, template_id: template.id })}
                                            className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.template_id === template.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
                                        >
                                            <div
                                                className={`w-full h-12 rounded-lg shadow-sm ${template.border ? 'border border-gray-200' : ''}`}
                                                style={{ background: template.color }}
                                            ></div>
                                            <span className={`text-[10px] uppercase tracking-wide font-bold ${formData.template_id === template.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                                                {template.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Picture Upload */}
                            <div className="flex justify-center py-6 border-y border-slate-50">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="w-10 h-10 text-slate-300" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-indigo-600 p-2.5 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-md transform hover:scale-105 transition-transform">
                                        <Upload className="w-4 h-4" />
                                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" placeholder="e.g. Alex Smith" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Profession / Title</label>
                                    <input required type="text" name="profession" value={formData.profession} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" placeholder="e.g. Product Designer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Company</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-indigo-500" />
                                    Google Map Location
                                </label>
                                <input
                                    type="text"
                                    name="google_map_link"
                                    value={formData.google_map_link}
                                    onChange={handleChange}
                                    className="input-field w-full p-2 border rounded-lg"
                                    placeholder="Paste your Google Maps link (https://maps.google.com...)"
                                />
                                <p className="text-xs text-slate-400">Link must start with https://maps.google.com or https://www.google.com/maps</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <h3 className="font-bold text-slate-800">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Website</label>
                                        <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field w-full p-2 border rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-4 h-4 text-indigo-500" />
                                    <h3 className="font-bold text-slate-800">Social Media Usernames</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['instagram', 'linkedin', 'facebook', 'twitter', 'youtube'].map(platform => (
                                        <div key={platform} className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm capitalize">{platform === 'linkedin' ? 'in/' : '@'}</span>
                                            <input
                                                name={platform}
                                                value={formData.social_links[platform]}
                                                onChange={handleSocialChange}
                                                className="pl-10 p-2 border rounded-lg w-full"
                                                placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <h3 className="font-bold text-slate-800">Theme Color</h3>
                                <div className="flex gap-3">
                                    {['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, theme_color: color })}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${formData.theme_color === color ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    {/* Custom Color Picker */}
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer group">
                                        <input
                                            type="color"
                                            value={formData.theme_color}
                                            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-black/10">
                                            <span className="text-lg font-bold text-slate-500">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 p-4 -mx-6 -mb-6 md:-mx-8 md:-mb-8 rounded-b-2xl z-10">
                                <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-200"
                                >
                                    {submitting || uploading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Update Card</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side: Live Preview (Sticky) */}
                <div className="w-full lg:w-1/2 order-1 lg:order-2">
                    <div className="lg:sticky lg:top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                Live Preview
                            </h2>
                            <div className="text-xs text-slate-400">Updates automatically</div>
                        </div>

                        <div className="bg-slate-200/50 rounded-3xl p-6 md:p-10 flex items-center justify-center min-h-[600px] border border-slate-200 shadow-inner">
                            <div className="transform scale-[0.85] md:scale-100 transition-transform duration-300 origin-center">
                                {renderPreview()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EditCard;
