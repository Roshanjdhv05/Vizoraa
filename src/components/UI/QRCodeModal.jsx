import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Download, Copy, Share2, X } from 'lucide-react';

const QRCodeModal = ({ card, onClose }) => {
    const qrRef = useRef();

    // Construct public URL. 
    // Ideally from env, but fallback to window.location.origin
    const getPublicUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/c/${card.id}`;
    };

    const publicUrl = getPublicUrl();

    const downloadQR = () => {
        const svg = document.getElementById("qr-code-svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width + 40; // Add padding
            canvas.height = img.height + 40;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 20, 20);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `${card.name || 'card'}-qr.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        alert('Link copied to clipboard!');
    };

    const shareCard = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: card.name,
                    text: `Check out ${card.name}'s digital card!`,
                    url: publicUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            copyLink();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-fadeInUp">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{card.name}</h3>
                    <p className="text-slate-500 text-sm">Scan to connect instantly</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 mb-8 flex justify-center shadow-inner">
                    <div className="bg-white p-2">
                        <QRCode
                            id="qr-code-svg"
                            value={publicUrl}
                            size={200}
                            level="H" // High error correction
                            fgColor="#000000"
                            bgColor="#ffffff"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={copyLink}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Copy className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">Copy Link</span>
                    </button>

                    <button
                        onClick={downloadQR}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Download className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">Download</span>
                    </button>

                    <button
                        onClick={shareCard}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">Share</span>
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg">
                        <span className="text-xs text-slate-400 font-mono truncate flex-1">{publicUrl}</span>
                        <button onClick={copyLink} className="text-indigo-600 font-bold text-xs hover:underline">COPY</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
