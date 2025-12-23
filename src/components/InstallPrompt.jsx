import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-0 flex justify-center w-full">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 flex items-center justify-between border border-gray-100 animate-slideDown">
                {/* Left Section: Icon & Text */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        {/* Using the favicon or app logo if available, falling back to V text */}
                        <img src="/logo.png" alt="Vizoraa" className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">Install Vizoraa</h3>
                    </div>
                </div>

                {/* Right Section: Install Button & Close */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleInstallClick}
                        className="text-[#0079D3] font-bold text-sm tracking-wide hover:opacity-80 transition-opacity"
                    >
                        Install
                    </button>

                    <div className="h-6 w-[1px] bg-gray-200"></div>

                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
