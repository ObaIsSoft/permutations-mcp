export function Navbar() {
    return (
        <nav className="w-full border-b-2 border-black bg-surface px-3 sm:px-4 md:px-12 py-3 sm:py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary border-2 border-black flex items-center justify-center p-0.5 sm:p-1">
                    {/* Permutations Organic Biomarker DNA - From Current Generation */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white biomarker-organic" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M10,90 Q50,22.627450980392155 90,10 Q93.68627450980392,50 10,90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
                <span className="font-display font-bold text-lg sm:text-xl uppercase tracking-tighter">PERMUTATIONS.</span>
            </div>

            <div className="flex gap-4 sm:gap-8 font-mono text-xs sm:text-sm uppercase items-center hidden md:flex">
                <a href="#manifesto" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>Story</a>
                <a href="#engine" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>The Engine</a>
                <a href="#docs" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>Docs</a>
                <a href="#docs" className="dna-btn py-1.5 sm:py-2 px-3 sm:px-4 text-[10px] sm:text-xs inline-block">
                    Initialize
                </a>
            </div>
        </nav>
    );
}
