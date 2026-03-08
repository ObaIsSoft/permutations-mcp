import { Brain, Hexagon, Code2, Network } from 'lucide-react';

export function Architecture() {
    const steps = [
        {
            icon: <Brain size={32} />,
            title: "01 / Planetary Survey",
            desc: "An LLM intercepts the human intent and evaluates the 'atmospheric conditions' across 4 mathematical vectors: Density, Urgency, Temperature, and Playfulness."
        },
        {
            icon: <Hexagon size={32} />,
            title: "02 / Genetic Seed",
            desc: "Instead of searching for a template, the vectors are injected into a deterministic SHA-256 hash. This guarantees the exact same lifeform emerges on the exact same planet, every time."
        },
        {
            icon: <Network size={32} />,
            title: "03 / Mathematical Epistasis",
            desc: "The 12-chromosome sequencer maps the hashes to strict CSS integers, forbidding specific combinations (like rounded edges on a brutalist config)."
        },
        {
            icon: <Code2 size={32} />,
            title: "04 / MCP Injection",
            desc: "The server injects the topology mapping directly into the context window of Windsurf, Cursor, or Claude Desktop. The AI codes the math, not the slop."
        }
    ];

    return (
        <section id="manifesto" className="w-full py-24 px-4 md:px-12 bg-white border-b-2 border-black">
            <div className="max-w-7xl w-full mx-auto">
                <div className="mb-16 border-b-2 border-black pb-4">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-primary">Evolutionary Architecture</h2>
                    <p className="font-mono mt-2 opacity-60">Locating the aesthetic Goldilocks Zone</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col group cursor-crosshair">
                            <div className="bg-gray-100 p-6 border-2 border-black mb-6 flex items-center justify-center h-32 group-hover:bg-primary group-hover:text-white transition-colors duration-genome">
                                {step.icon}
                            </div>
                            <h3 className="font-display font-bold text-xl uppercase mb-3 border-b border-gray-300 pb-2">{step.title}</h3>
                            <p className="font-body opacity-80 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
