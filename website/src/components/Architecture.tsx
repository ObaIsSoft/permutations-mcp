import { Brain, Hexagon, Code2, Network } from 'lucide-react';

export function Architecture() {
    const steps = [
        {
            icon: <Brain size={32} />,
            title: "01 / Planetary Survey",
            desc: "An LLM intercepts the human intent and evaluates the 'atmospheric conditions' across 5 mathematical vectors: Density, Urgency, Temperature, Playfulness, and Spatial."
        },
        {
            icon: <Hexagon size={32} />,
            title: "02 / Genetic Seed",
            desc: "Vectors are injected into a deterministic SHA-256 hash. The same lifeform emerges on the same planet, every time. State is mathematical, not memorized."
        },
        {
            icon: <Network size={32} />,
            title: "03 / Epigenetic Override",
            desc: "Upload brand assets (logos, PDFs) to extract dominant hues and context. The epigenetic layer forcibly overrides hash-generated values to match existing brand DNA."
        },
        {
            icon: <Code2 size={32} />,
            title: "04 / MCP Injection",
            desc: "The server injects topology mapping directly into Windsurf, Cursor, or Claude Desktop. The AI codes the math, not the slop. Glass organisms emerge."
        }
    ];

    return (
        <section id="manifesto" className="w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-white border-b-2 border-black">
            <div className="max-w-7xl w-full mx-auto">
                <div className="mb-12 sm:mb-16 md:mb-20 border-b-2 border-black pb-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-primary">Evolutionary Architecture</h2>
                    <p className="font-mono mt-3 text-xs sm:text-sm opacity-60">Locating the aesthetic Goldilocks Zone via Epigenetics</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col group cursor-crosshair">
                            <div 
                                className="bg-gray-100 p-6 sm:p-8 border-2 border-black mb-5 sm:mb-6 flex items-center justify-center h-28 sm:h-32 group-hover:bg-primary group-hover:text-white transition-all duration-genome"
                                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                            >
                                {step.icon}
                            </div>
                            <h3 className="font-display font-bold text-lg sm:text-xl uppercase mb-3 border-b border-gray-300 pb-2">{step.title}</h3>
                            <p className="font-body opacity-80 leading-relaxed text-xs sm:text-sm">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
