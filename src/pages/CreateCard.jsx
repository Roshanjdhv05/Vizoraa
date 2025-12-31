import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CreditCard, Save, Loader2, Link as LinkIcon, Camera, Upload, MapPin, Star, LayoutTemplate } from 'lucide-react';

import ModernCard from '../components/Templates/ModernCard';
import ConferenceGradientCard from '../components/Templates/ConferenceGradientCard';
import MinimalistCard from '../components/Templates/MinimalistCard';

import GlassmorphismCard from '../components/Templates/GlassmorphismCard';

import RedGeometricCard from '../components/Templates/RedGeometricCard';
import ProfessionalDevCard from '../components/Templates/ProfessionalDevCard';
import HeroCoverProfileCard from '../components/Templates/HeroCoverProfileCard';
import CircularModernCard from '../components/Templates/CircularModernCard';
import FlipCard from '../components/Templates/FlipCard';

const PREMIUM_TEMPLATES = ['hero-cover-profile', 'flip-card'];

const CreateCard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [unlockedTemplates, setUnlockedTemplates] = useState([]);

    useEffect(() => {
        checkUserTemplates();
    }, []);

    const checkUserTemplates = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('unlocked_templates').eq('id', user.id).single();
            if (profile && profile.unlocked_templates) {
                setUnlockedTemplates(profile.unlocked_templates);
            }
        }
    };

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
        cover_url: '',
        category: 'Personal',
        theme_color: '#6366f1',
        template_id: 'modern',
        social_links: {
            instagram: '',
            linkedin: '',
            facebook: '',
            twitter: '',
            twitter: '',
            youtube: '',
            whatsapp: ''
        }
    });

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

    const handleCoverSelect = async (e) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setCoverFile(file);
        setCoverUrl(URL.createObjectURL(file)); // Preview
    };

    const uploadAvatar = async (userId) => {
        if (!avatarFile) return null;

        try {
            setUploading(true);
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Note: 'avatars' bucket must exist and be public
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Make sure "avatars" bucket exists in Supabase.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const uploadFile = async (file, userId, bucket = 'avatars') => {
        if (!file) return null;

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            // alert(`Error uploading file to ${bucket}.`); // Suppress alert for smooth UX
            return null;
        } finally {
            setUploading(false);
        }
    };

    // Helper to format social links
    const formatSocialUrl = (platform, username) => {
        if (!username) return '';
        if (username.startsWith('http')) return username; // Already a URL

        username = username.replace('@', ''); // Remove @ if present

        switch (platform) {
            case 'instagram': return `https://instagram.com/${username}`;
            case 'linkedin': return `https://linkedin.com/in/${username}`;
            case 'facebook': return `https://facebook.com/${username}`;
            case 'twitter': return `https://twitter.com/${username}`;
            case 'twitter': return `https://twitter.com/${username}`;
            case 'youtube': return `https://youtube.com/@${username}`;
            case 'whatsapp': return `https://wa.me/${username}`;
            default: return username;
        }
    };

    // Helper to load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpay();

        if (!res) {
            alert('Razropay SDK failed to load. Are you online?');
            return false;
        }

        const razropayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razropayKey) {
            alert('Payment Configuration Error: Razorpay Key ID not found.');
            return false;
        }

        // 1. Create a dummy order or just use manual client-side capture for prototype
        // In production, you would call your backend API here to create an order: /api/create-order

        const options = {
            key: razropayKey,
            key: razropayKey,
            amount: 9900, // ₹99 (9900 paise)
            currency: 'INR',
            name: 'Vizoraa Premium Card',
            description: 'Unlock Hero Cover Template',
            image: avatarUrl || 'https://via.placeholder.com/150',
            handler: function (response) {
                // Payment Success!
                // alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                createCard(true, response.razorpay_payment_id);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: 'Vizoraa Corporate Office'
            },
            theme: {
                color: '#f97316'
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            alert(`Payment Failed: ${response.error.description}`);
            setLoading(false);
        });
        paymentObject.open();
    };

    const createCard = async (isPremium = false, paymentId = null) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Upload Images
            let finalAvatarUrl = null;
            if (avatarFile) {
                finalAvatarUrl = await uploadFile(avatarFile, user.id, 'avatars');
            } else if (avatarUrl && avatarUrl.startsWith('http')) {
                // Keep existing user avatar if editing (though this is create card)
                finalAvatarUrl = avatarUrl;
            }

            let finalCoverUrl = null;
            if (coverFile) {
                finalCoverUrl = await uploadFile(coverFile, user.id, 'card_covers');
            }

            // Process Social Links
            const processedSocials = {};
            Object.entries(formData.social_links).forEach(([key, value]) => {
                const url = formatSocialUrl(key, value);
                if (url) processedSocials[key] = url;
            });

            const { error } = await supabase.from('cards').insert({
                user_id: user.id,
                ...formData,
                avatar_url: finalAvatarUrl,
                cover_url: finalCoverUrl,
                social_links: processedSocials,
                is_premium: isPremium, // Track premium status
                payment_id: paymentId  // Store payment ID if any
            });

            if (error) throw error;
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for Google Map Link
        if (formData.google_map_link && !formData.google_map_link.startsWith('http')) {
            alert('Please enter a valid Google Maps link (e.g., https://maps.app.goo.gl/...)');
            return;
        }

        setLoading(true);

        // Check for Unlocked Template
        const isTemplateUnlocked = unlockedTemplates?.includes(formData.template_id);

        if (isTemplateUnlocked) {
            // Bypass Payment for Unlocked Template
            await createCard(true); // Treat as premium
            return;
        }

        // Check if Premium Template
        // Check if Premium Template
        if (PREMIUM_TEMPLATES.includes(formData.template_id)) {
            // Trigger Payment Flow
            await handlePayment();
        } else {
            // Create Free Card Directly
            await createCard(false);
        }
    };

    // Prepare preview data
    const previewCard = {
        ...formData,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        cover_type: coverFile?.type, // Pass type for preview detection
        // Since we are typing usernames but templates expect URLs, let's format them for preview on the fly
        social_links: Object.keys(formData.social_links).reduce((acc, key) => {
            const username = formData.social_links[key];
            if (username) acc[key] = formatSocialUrl(key, username);
            return acc;
        }, {})
    };

    const renderPreview = () => {
        // Fallback UI if no template selected (though default is set)
        if (!formData.template_id) {
            return (
                <div className="flex flex-col items-center justify-center h-[500px] w-full text-slate-400">
                    <LayoutTemplate className="w-12 h-12 mb-4 opacity-50" />
                    <p>Select a template to preview</p>
                </div>
            );
        }

        const props = {
            card: previewCard,
            isSaved: false,
            isLiked: false,
            userRating: 0,
            ratingStats: { average: 0, count: 0 },
            showRating: false,
            handleLike: (e) => e && e.preventDefault(),
            handleSave: (e) => e && e.preventDefault(),
            handleRate: (val) => console.log("Rate:", val)
        };

        // Dynamic Template Rendering with Error Boundary Concept
        try {
            switch (formData.template_id) {
                case 'conference-gradient': return <ConferenceGradientCard {...props} />;
                case 'minimalist': return <MinimalistCard {...props} />;
                case 'glassmorphism': return <GlassmorphismCard {...props} />;
                case 'hero-cover-profile': return <HeroCoverProfileCard {...props} />;
                case 'red-geometric': return <RedGeometricCard {...props} />;
                case 'circular-modern': return <CircularModernCard {...props} />;
                case 'professional-dev': return <ProfessionalDevCard {...props} />;
                case 'flip-card': return <FlipCard {...props} />;
                case 'modern': return <ModernCard {...props} />;
                default:
                    console.warn(`Template ID "${formData.template_id}" not found. Falling back to Modern.`);
                    return <ModernCard {...props} />;
            }
        } catch (error) {
            console.error("Template rendering failed:", error);
            return (
                <div className="flex flex-col items-center justify-center h-[500px] w-full text-red-400 bg-red-50 rounded-2xl border border-red-100">
                    <p>Error rendering preview</p>
                    <span className="text-xs mt-2">{error.message}</span>
                </div>
            );
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
                                <h1 className="text-2xl font-bold text-slate-800">Create Digital Card</h1>
                                <p className="text-slate-500">Fill in your details to generate your card</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Template Selection */}
                            <div className="space-y-6">
                                {/* Standard Templates */}
                                <div className="space-y-3">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        Standard Templates
                                        <span className="text-xs font-normal bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Free</span>
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            { id: 'modern', name: 'Modern', color: '#6366f1' },
                                            { id: 'conference-gradient', name: 'Conference', color: '#EEDBFF' },
                                            { id: 'minimalist', name: 'Minimalist', color: '#ffffff', border: true },
                                            { id: 'glassmorphism', name: 'Glass', color: '#FC466B' },
                                            { id: 'red-geometric', name: 'Geometric', color: '#EF4444' },
                                            { id: 'circular-modern', name: 'Modern Circ', color: '#10b981' },
                                            { id: 'professional-dev', name: 'Dev Pro', color: '#1e1e1e' },
                                            { id: 'circular-modern', name: 'Modern Circ', color: '#10b981' },
                                            { id: 'professional-dev', name: 'Dev Pro', color: '#1e1e1e' }
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

                                {/* Premium Templates */}
                                <div className="space-y-3">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        Premium Templates
                                        <span className="text-xs font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" /> Pro
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {[
                                            { id: 'hero-cover-profile', name: 'Hero Cover', color: '#f97316' },
                                            { id: 'flip-card', name: 'Flip Card', color: '#334155' }
                                        ].map(template => (
                                            <button
                                                key={template.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, template_id: template.id })}
                                                className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-2 overflow-hidden ${formData.template_id === template.id ? 'border-amber-500 bg-amber-50' : 'border-slate-100 hover:border-amber-200'}`}
                                            >
                                                {unlockedTemplates?.includes(template.id) ? (
                                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10 flex items-center gap-1">
                                                        <LayoutTemplate className="w-2 h-2" /> UNLOCKED
                                                    </div>
                                                ) : (
                                                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg z-10">PRO</div>
                                                )}

                                                <div
                                                    className={`w-full h-12 rounded-lg shadow-sm relative overflow-hidden`}
                                                    style={{ background: template.color }}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-wide font-bold ${formData.template_id === template.id ? 'text-amber-700' : 'text-slate-500'}`}>
                                                    {template.name}
                                                </span>

                                                {unlockedTemplates?.includes(template.id) ? (
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 rounded border border-green-200">
                                                        Free
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-900 bg-white px-1.5 rounded border border-slate-200">
                                                        ₹99
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
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

                            {/* Cover Image Upload (For Hero & Flip Templates) */}
                            {(formData.template_id === 'hero-cover-profile' || formData.template_id === 'flip-card') && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        Cover Image
                                        {formData.template_id === 'hero-cover-profile' && (
                                            <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Premium Feature</span>
                                        )}
                                    </label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative overflow-hidden group cursor-pointer">
                                        {coverUrl ? (
                                            (coverFile?.type.startsWith('video/') || coverUrl.match(/\.(mp4|webm|ogg)$/i)) ? (
                                                <video src={coverUrl} className="w-full h-32 object-cover rounded-lg" autoPlay loop muted playsInline />
                                            ) : (
                                                <img src={coverUrl} alt="Cover Preview" className="w-full h-32 object-cover rounded-lg" />
                                            )
                                        ) : (
                                            <div className="text-slate-400 py-4">
                                                <Upload className="w-8 h-8 mx-auto mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                                                <p className="text-xs">
                                                    Click to upload cover media
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept={formData.template_id === 'flip-card' ? "image/*,video/mp4,video/webm" : "image/*"}
                                            onChange={handleCoverSelect}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Alex Smith" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Profession / Title</label>
                                    <input required type="text" name="profession" value={formData.profession} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Product Designer" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-slate-700">Card Category</label>
                                <div className="flex flex-wrap gap-3">
                                    {['Personal', 'Business', 'Freelancer'].map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${formData.category === cat
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Company</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Acme Corp" />
                                </div>
                                {/* Location restricted to Hero Template */}
                                {formData.template_id === 'hero-cover-profile' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-sm font-medium text-slate-700">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="City, Country" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex justify-between">
                                    About
                                    <span className="text-xs text-slate-400">{formData.about?.length || 0}/150</span>
                                </label>
                                <textarea
                                    name="about"
                                    maxLength={150}
                                    value={formData.about || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                    placeholder="Write a short bio about yourself..."
                                />
                            </div>

                            {formData.template_id === 'hero-cover-profile' && (
                                <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                        Google Map Location
                                        <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Premium</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="google_map_link"
                                        value={formData.google_map_link}
                                        onChange={handleChange}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Paste your Google Maps link"
                                    />
                                    <p className="text-xs text-slate-400">Link must start with https://maps.google.com</p>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <h3 className="font-bold text-slate-800">Contact Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="+1 234 567 890" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="alex@example.com" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Website</label>
                                        <input type="url" name="website" value={formData.website} onChange={handleChange} className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="https://mysite.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <LinkIcon className="w-4 h-4 text-indigo-500" />
                                    <h3 className="font-bold text-slate-800">Social Media Usernames</h3>
                                </div>
                                <p className="text-xs text-slate-500 -mt-3 mb-4">Just enter your username, we'll handle the links</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['instagram', 'linkedin', 'facebook', 'twitter', 'youtube', 'whatsapp'].map(platform => (
                                        <div key={platform} className="relative group">
                                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm capitalize">{platform === 'linkedin' ? 'in/' : '@'}</span>
                                            <input
                                                name={platform}
                                                value={formData.social_links[platform]}
                                                onChange={handleSocialChange}
                                                className="pl-10 p-2 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.theme_color === color ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    {/* Custom Color Picker */}
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors cursor-pointer group">
                                        <input
                                            type="color"
                                            value={formData.theme_color}
                                            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:bg-black/10">
                                            <span className="text-[10px font-bold text-slate-800">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 p-4 -mx-6 -mb-6 md:-mx-8 md:-mb-8 rounded-b-2xl z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                                <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-8 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 shadow-lg transition-all transform active:scale-95 ${formData.template_id === 'hero-cover-profile' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 text-white' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 text-white'}`}
                                >
                                    {loading || uploading ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        <>
                                            {PREMIUM_TEMPLATES.includes(formData.template_id) && !unlockedTemplates?.includes(formData.template_id) ? (
                                                <>
                                                    <Star className="w-5 h-5 fill-current" /> Pay & Create Card (₹99)
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    {unlockedTemplates?.includes(formData.template_id) ? 'Create Information Card (Free)' : 'Create Card'}
                                                </>
                                            )}
                                        </>
                                    )}
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

                        <div className="bg-slate-200/50 rounded-3xl p-4 md:p-10 flex items-center justify-center min-h-[550px] md:min-h-[600px] border border-slate-200 shadow-inner">
                            <div className="w-full flex justify-center md:block md:w-auto md:transform md:scale-100 transition-transform duration-300 origin-center">
                                {renderPreview()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateCard;
