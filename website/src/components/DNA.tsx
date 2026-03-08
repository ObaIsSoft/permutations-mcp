import { Fingerprint, Database, CheckCircle2 } from 'lucide-react';

export function DNA() {
    return (
        <section id="engine" className="w-full py-24 px-4 md:px-12 bg-white border-b-2 border-black">
            <div className="max-w-7xl w-full mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-black pb-4">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight flex items-center gap-4">
                        <Fingerprint size={40} className="text-primary hidden md:block" />
                        The Parametric DNA
                    </h2>
                    <div className="font-mono text-sm opacity-60 mt-4 md:mt-0">Computed via cryptographic epistasis</div>
                </div>

                {/* True Broken Grid Layout per Topological DNA */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">

                    {/* Block A: Hash */}
                    <div className="md:col-span-4 dna-card bg-gray-100 flex flex-col justify-between p-8 border-2 border-black hover:-translate-y-1 transition-transform duration-genome">
                        <div>
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
                                <Database size={24} className="text-primary" />
                                <h3 className="font-bold text-2xl uppercase">01 / Hash Matrix</h3>
                            </div>
                            <p className="font-body opacity-80 leading-relaxed text-sm">
                                Deterministic cryptography ensures absolute consistency. The same project seed yields the same DNA, forever. State is maintained mathematically, not in a database.
                            </p>
                        </div>
                        <div className="mt-8">
                            <div className="text-xs uppercase font-bold mb-1 opacity-50 flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-primary" /> SHA-256 Output Seed
                            </div>
                            <div className="font-mono text-sm text-primary break-all bg-white p-4 border border-gray-300 shadow-[4px_4px_0px_#000]">
                                3cd02634a22de5029b5359ce0da8003e585a3b45df68559022acf378cb77df77
                            </div>
                        </div>
                    </div>

                    {/* Block B: Semantic Vectors (The dominant broken column) */}
                    <div className="md:col-span-5 dna-card bg-black text-white p-8 md:-translate-y-12 relative shadow-[12px_12px_0px_#0a5c12] border-2 border-black hover:-translate-y-14 transition-transform duration-genome">
                        <div className="absolute top-6 right-6 text-xs font-mono text-primary animate-pulse flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary"></div>
                            LIVE EXTRACTION
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-bold uppercase mb-10 text-primary">Semantic Vectors</h3>
                        <ul className="font-body text-xl space-y-6 font-mono">
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm md:text-base">InformationDensity</span>
                                <span className="text-primary font-bold">0.70</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm md:text-base">TemporalUrgency</span>
                                <span className="text-primary font-bold">0.20</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm md:text-base">EmotionalTemp</span>
                                <span className="text-primary font-bold">0.10</span>
                            </li>
                            <li className="flex justify-between pb-2 group">
                                <span className="group-hover:translate-x-2 transition-transform duration-genome text-sm md:text-base">Playfulness</span>
                                <span className="text-primary font-bold">0.05</span>
                            </li>
                        </ul>

                        <div className="mt-12 p-6 bg-gray-900 border-l-4 border-primary">
                            <p className="text-sm font-mono leading-relaxed">
                                <strong className="text-white block mb-2 uppercase tracking-widest text-xs">Epistasis Rule Applied:</strong>
                                <span className="text-gray-400">Low Emotional Temp (<span className="text-white">0.1</span>) + Zero Playfulness (<span className="text-white">0.05</span>) mathematically forbids border radii &gt; 0px and enforces step-based CSS transitions. Softness is mathematically impossible in this biome.</span>
                            </p>
                        </div>
                    </div>

                    {/* Block C: Image/Visual (Abstract Data Representation) */}
                    <div className="md:col-span-3 dna-card bg-primary text-white flex flex-col justify-between p-8 md:translate-y-16 border-2 border-black hover:translate-y-14 transition-transform duration-genome">
                        <div className="w-full h-32 border-b-2 border-white/20 mb-6 relative hover:opacity-80 transition-opacity">
                            {/* Decorative math/waveform generated via CSS */}
                            <div className="absolute bottom-0 w-[20%] h-full bg-white/20 left-0 hover:h-[90%] transition-all duration-genome"></div>
                            <div className="absolute bottom-0 w-[20%] h-[70%] bg-white/40 left-[25%] hover:h-[100%] transition-all duration-genome"></div>
                            <div className="absolute bottom-0 w-[20%] h-[90%] bg-white/60 left-[50%] hover:h-[40%] transition-all duration-genome"></div>
                            <div className="absolute bottom-0 w-[20%] h-[40%] bg-white left-[75%] hover:h-[80%] transition-all duration-genome"></div>
                        </div>
                        <h3 className="font-display font-bold text-2xl md:text-3xl uppercase leading-[1.1]">
                            15 Chromosomes. Infinite Biomes.
                        </h3>
                    </div>

                    {/* Block D: Code Output */}
                    <div className="md:col-span-12 mt-12 md:mt-4 p-8 bg-gray-50 border-2 border-black group">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl md:text-2xl uppercase">Generated output: Architecture Config</h3>
                            <span className="text-xs font-mono uppercase bg-black text-white px-2 py-1">mcp_response.json</span>
                        </div>

                        <pre className="bg-black text-green-400 p-6 font-mono text-sm overflow-x-auto shadow-[4px_4px_0px_#0a5c12] group-hover:shadow-[8px_8px_0px_#0a5c12] transition-shadow duration-genome">
                            <code>{`{
  "gridType": "broken",
  "maxNesting": 1,
  "sections": [
    {
      "type": "hero",
      "fullViewport": true
    },
    {
      "type": "content_blocks",
      "layout": "broken"
    },
    {
      "type": "footer",
      "minimal": false
    }
  ],
  "forbidden": [
    "bounce_animations",
    "comic_sans",
    "heavy_blur_effects"
  ],
  "required": [
    "high_contrast_text",
    "tabular_numerals"
  ]
}`}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
