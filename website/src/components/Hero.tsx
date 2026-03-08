import { ArrowRight, Box } from 'lucide-react';

export function Hero() {
    return (
        <section className="w-full min-h-[90vh] flex flex-col justify-center px-4 md:px-12 border-b-2 border-black bg-surface relative overflow-hidden">
            {/* Abstract geometric background elements obeying 0px radius */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-100 -z-10 border-l border-gray-200" />
            <div className="absolute top-20 right-20 w-64 h-64 border-4 border-primary opacity-20 hidden md:flex items-center justify-center">
                <Box size={140} className="text-primary opacity-20" strokeWidth={1} />
            </div>

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary text-white font-body text-xs tracking-widest uppercase py-1 px-3 mb-6">
                    <div className="w-2 h-2 bg-white rounded-genome" />
                    Evolutionary Design Engine
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold leading-[0.85] uppercase mb-8 max-w-6xl tracking-tighter">
                    LIFE ADAPTS.<br />SLOP DOESN'T.
                </h1>
                <p className="text-xl md:text-2xl font-body max-w-3xl mb-12 opacity-80 border-l-4 border-primary pl-6">
                    A template is a dead organism. The Permutations MCP intercepts human intent and mathematically evolves unique design systems. Just as life forces distinct mutations in different planetary environments—avian, microbe, or silicon—we force AI coders to generate UI biomes perfectly adapted to your context.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 font-display">
                    <a href="#docs" className="dna-btn flex items-center justify-center gap-2">
                        Install Permutations MCP <ArrowRight size={18} />
                    </a>
                    <a href="#manifesto" className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-genome font-bold uppercase tracking-wider flex items-center justify-center">
                        Read Story
                    </a>
                </div>
            </div>
        </section>
    );
}
