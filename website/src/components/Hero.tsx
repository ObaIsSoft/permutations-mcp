import { ArrowRight } from 'lucide-react';
import { Procedural3D } from './Procedural3D';

export function Hero() {
    return (
        <section className="w-full min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 border-b-2 border-black bg-surface relative overflow-hidden">
            {/* Permutations Procedural Spatial & Atmosphere DNA - Glass Organism */}
            {/* Mobile: smaller, positioned top-right */}
            <div className="absolute right-0 top-20 w-[40vw] h-[30vh] sm:w-[35vw] sm:h-[35vh] md:w-[45vw] md:h-[60vh] lg:w-[50vw] lg:h-[80vh] lg:top-1/2 lg:-translate-y-1/2 z-0 opacity-60 sm:opacity-70 lg:opacity-90 pointer-events-none">
                <Procedural3D />
            </div>
            
            {/* Subtle gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-[50vw] sm:w-[55vw] lg:w-[60vw] bg-gradient-to-l from-transparent via-surface/50 to-surface/95 z-0 pointer-events-none" />
            
            <div className="fx-atmosphere" />

            <div className="max-w-7xl w-full mx-auto relative z-10 pt-20 sm:pt-16 md:pt-0">
                <div 
                    className="inline-flex items-center gap-2 bg-primary text-white font-body text-[10px] sm:text-xs tracking-widest uppercase py-1.5 px-3 mb-6 sm:mb-8 rounded-genome"
                >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-genome animate-pulse" />
                    Permutations Engine
                </div>
                
                {/* Mobile-optimized headline with better spacing */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[9rem] font-bold leading-[0.9] sm:leading-[0.85] uppercase mb-8 sm:mb-10 max-w-6xl tracking-tighter">
                    <span className="block">LIFE ADAPTS.</span>
                    <span className="block">SLOP DOESN'T.</span>
                </h1>
                
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-body max-w-3xl mb-10 sm:mb-14 opacity-80 border-l-4 border-primary pl-4 sm:pl-6 leading-relaxed">
                    A template is a dead organism. The Permutations MCP intercepts human intent and mathematically evolves unique design systems. As life forces distinct mutations in different planetary environments, we force AI coders to generate UI biomes perfectly adapted to your context.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 font-display">
                    <a href="#docs" className="dna-btn flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4">
                        Install Permutations MCP <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </a>
                    <a 
                        href="#manifesto" 
                        className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-black hover:bg-black hover:text-white transition-all duration-genome font-bold uppercase tracking-wider flex items-center justify-center rounded-genome text-sm sm:text-base"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                        Read Story
                    </a>
                </div>
            </div>
        </section>
    );
}
