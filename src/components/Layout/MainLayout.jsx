import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = ({ children, session }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar
                session={session}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-30 px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="font-bold text-lg text-slate-900 tracking-tight">Vizoraa</span>
                <div className="w-8" /> {/* Spacer for centering if needed, or user avatar */}
            </div>

            {/* Main Content Area */}
            {/* Logic: Full width on mobile (ml-0), pushed by sidebar on Desktop (md:ml-[280px]) 
                User req: "Above 1024px, show full sidebar". So md might be too small? 
                Let's stick to standard Responsive: usually md is tablet (768px). 
                If user wants tablet to have hamburger, I should use `lg` (1024px) breakpoint for the fixed sidebar.
                So: Sidebar has `hidden lg:flex` (handled inside Sidebar component actually via `-translate-x-full lg:translate-x-0`).
                Here margin should be `lg:ml-[280px]`.
            */}
            <main className="transition-[margin,padding] duration-300 ease-in-out lg:ml-[280px] pt-20 md:pt-0 min-h-screen">
                <div className="animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
