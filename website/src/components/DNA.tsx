import { Fingerprint, Database, CheckCircle2 } from 'lucide-react';

export function DNA() {
    // Current DNA Values from Generation
    const dnaHash = "2f51eec6c7043eedf0fc9f69a4181997b79e0f7c792e8389c1faf478b1a46c30";
    const traits = {
        informationDensity: 0.7,
        temporalUrgency: 0.8,
        emotionalTemperature: 0.6,
        playfulness: 0.9,
        spatialDependency: 0.8
    };
    const chromosomes = {
        topology: "radial",
        grid: "masonry",
        motion: "spring",
        fx: "fluid_mesh",
        material: "glass",
        biomarker: "organic",
        radius: 9
    };

    return (
        <section id="engine" className="w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white border-b-2 border-black relative">
            <div className="max-w-7xl w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 md:mb-20 border-b-2 border-black pb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight flex items-center gap-3 sm:gap-4">
                        <Fingerprint size={36} className="text-primary" />
                        The Parametric DNA
                    </h2>
                    <div className="font-mono text-xs sm:text-sm opacity-60 mt-2 md:mt-0">Biological Planetary Adaptation</div>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                    {/* Block A: Hash */}
                    <div className="lg:col-span-4 dna-card bg-gray-100 flex flex-col justify-between p-6 sm:p-8 border-2 border-black hover:-translate-y-1 transition-transform duration-genome order-1" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div>
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
                                <Database size={24} className="text-primary" />
                                <h3 className="font-bold text-xl sm:text-2xl uppercase">01 / Hash Matrix</h3>
                            </div>
                            <p className="font-body opacity-80 leading-relaxed text-sm">
                                Deterministic SHA-256 cryptography ensures absolute consistency. Same seed yields identical DNA forever. State is maintained mathematically.
                            </p>
                        </div>
                        <div className="mt-6 sm:mt-8">
                            <div className="text-xs uppercase font-bold mb-1 opacity-50 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-primary" /> Current DNA Output
                            </div>
                            <div className="font-mono text-xs text-primary break-all bg-white p-4 border border-gray-300 shadow-[4px_4px_0px_#7f93c9]">
                                {dnaHash}
                            </div>
                        </div>
                    </div>

                    {/* Block B: Semantic Vectors */}
                    <div className="lg:col-span-5 dna-card bg-black text-white p-6 sm:p-8 relative shadow-[8px_8px_0px_#7f93c9] sm:shadow-[12px_12px_0px_#7f93c9] border-2 border-black hover:-translate-y-1 transition-transform duration-genome order-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-xs font-mono text-primary animate-pulse flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-genome"></div>
                            LIVE
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase mb-8 sm:mb-10 text-primary">Semantic Vectors</h3>
                        <ul className="font-body text-lg sm:text-xl space-y-4 sm:space-y-6 font-mono">
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm sm:text-base truncate mr-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>InformationDensity</span>
                                <span className="text-primary font-bold">{traits.informationDensity.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm sm:text-base truncate mr-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>TemporalUrgency</span>
                                <span className="text-primary font-bold">{traits.temporalUrgency.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm sm:text-base truncate mr-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>EmotionalTemp</span>
                                <span className="text-primary font-bold">{traits.emotionalTemperature.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm sm:text-base truncate mr-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>Playfulness</span>
                                <span className="text-primary font-bold">{traits.playfulness.toFixed(2)}</span>
                            </li>
                            <li className="flex justify-between pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm sm:text-base truncate mr-2" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>SpatialDependency</span>
                                <span className="text-primary font-bold">{traits.spatialDependency.toFixed(2)}</span>
                            </li>
                        </ul>

                        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-900 border-l-4 border-primary">
                            <p className="text-xs sm:text-sm font-mono leading-relaxed">
                                <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Epistasis Rule Applied:</strong>
                                <span className="text-gray-400">High Playfulness (<span className="text-white">{traits.playfulness}</span>) + High Spatial (<span className="text-white">{traits.spatialDependency}</span>) forces spring physics, {chromosomes.radius}px organic radius, and glass material with fluid mesh FX.</span>
                            </p>
                        </div>
                    </div>

                    {/* Block C: Chromosomes */}
                    <div className="lg:col-span-3 dna-card bg-primary text-white flex flex-col justify-between p-6 sm:p-8 border-2 border-black hover:-translate-y-1 transition-transform duration-genome order-3" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/30 pb-2">
                                <span className="text-xs uppercase opacity-70">Topology</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.topology}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/30 pb-2">
                                <span className="text-xs uppercase opacity-70">Grid</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.grid}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/30 pb-2">
                                <span className="text-xs uppercase opacity-70">Motion</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.motion}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/30 pb-2">
                                <span className="text-xs uppercase opacity-70">FX</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.fx}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/30 pb-2">
                                <span className="text-xs uppercase opacity-70">Material</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.material}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs uppercase opacity-70">Biomarker</span>
                                <span className="font-bold uppercase text-sm">{chromosomes.biomarker}</span>
                            </div>
                        </div>
                        <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase leading-[1.1] mt-8">
                            15 Chromosomes.<br />Glass Organism.
                        </h3>
                    </div>

                    {/* Block D: Code Output */}
                    <div className="lg:col-span-12 mt-6 sm:mt-8 p-6 sm:p-8 bg-gray-50 border-2 border-black group order-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                            <h3 className="font-bold text-lg sm:text-xl md:text-2xl uppercase">Generated Output: Tailwind Config</h3>
                            <span className="text-xs font-mono uppercase bg-black text-white px-2 py-1">tailwind.config.js</span>
                        </div>

                        <pre className="bg-black text-green-400 p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto shadow-[4px_4px_0px_#7f93c9] group-hover:shadow-[8px_8px_0px_#7f93c9] transition-shadow duration-genome" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                            <code>{`{
  "colors": {
    "primary": { "DEFAULT": "#7f93c9", "hue": 224 },
    "background": "#f5f5f5",
    "surface": "#ffffff"
  },
  "fontFamily": {
    "display": ["Space Mono", "JetBrains Mono", "monospace"],
    "body": ["IBM Plex Mono", "Courier", "monospace"]
  },
  "borderRadius": { "genome": "9px" },
  "transitionTimingFunction": { 
    "genome": "cubic-bezier(0.34, 1.56, 0.64, 1)" 
  },
  "transitionDuration": { "genome": "376ms" }
}`}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
