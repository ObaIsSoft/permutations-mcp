import { Github, Dna } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-black text-white border-t-4 sm:border-t-[6px] md:border-t-[8px] border-primary">
            {/* Main Content - Stacked on mobile, row on desktop */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 md:py-16">
                {/* Top: Logo & Tagline */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center p-1">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10,90 Q50,22.627450980392155 90,10 Q93.68627450980392,50 10,90" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-bold uppercase tracking-wider text-base sm:text-lg">Permutations</span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm font-mono">
                        MCP Server v1.0.0 • Generates unique design DNA
                    </p>
                </div>

                {/* Middle: DNA Attribution */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-10 py-6 sm:py-8 border-y border-gray-800">
                    <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs sm:text-sm mb-3">
                        <Dna size={14} />
                        Designed with Permutations DNA
                    </div>
                    <p className="text-gray-500 text-[10px] sm:text-xs font-mono leading-relaxed">
                        Topology: radial • Grid: masonry • Motion: spring • Material: glass
                    </p>
                </div>

                {/* Bottom: Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <a 
                        href="https://github.com/ObaIsSoft/Permutations" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs sm:text-sm hover:text-primary transition-colors"
                    >
                        <Github size={16} />
                        View on GitHub
                    </a>
                    
                    <div className="hidden sm:block w-px h-4 bg-gray-700" />
                    
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-primary">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        System Online
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 sm:py-5">
                    <p className="text-center text-gray-500 text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                        No Templates. No Slop. Only Math.
                    </p>
                </div>
            </div>
        </footer>
    );
}
