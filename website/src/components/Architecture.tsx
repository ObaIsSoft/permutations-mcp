import { Brain, Hexagon, Network, Code2 } from 'lucide-react';

const steps = [
    {
        icon: Brain,
        num: '01',
        title: 'Planetary Survey',
        subtitle: 'Semantic Extraction',
        desc: 'An LLM intercepts the human intent and evaluates atmospheric conditions across 5 mathematical vectors: Density, Urgency, Temperature, Playfulness, and Spatial dependency.',
    },
    {
        icon: Hexagon,
        num: '02',
        title: 'Genetic Seed',
        subtitle: 'SHA-256 Sequencing',
        desc: 'Trait vectors are injected into a deterministic SHA-256 hash. Same lifeform on the same planet, every time. State is mathematical — not memorized.',
    },
    {
        icon: Network,
        num: '03',
        title: 'Epigenetic Override',
        subtitle: 'Brand Asset Parsing',
        desc: 'Upload logos or PDFs. Dominant hues are extracted via sharp image processing. The epigenetic layer overrides hash-generated values to match existing brand DNA.',
    },
    {
        icon: Code2,
        num: '04',
        title: 'MCP Injection',
        subtitle: 'IDE Protocol',
        desc: 'The sequenced genome injects topology, tokens, 3D components, and FX layers directly into Windsurf, Cursor, or Claude Desktop. The AI codes the math.',
    },
];

export function Architecture() {
    return (
        <section id="manifesto" className="w-full py-24 md:py-36 px-6 md:px-12"
            style={{ background: 'var(--color-surface)' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '32px' }}>
                    <div>
                        <div className="section-line" />
                        <p className="dna-label mb-3">Evolutionary Architecture</p>
                        <h2 className="font-display font-bold uppercase text-white"
                            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
                            Finding the<br />Goldilocks Zone
                        </h2>
                    </div>
                    <p className="font-mono text-xs max-w-sm" style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
                        4 phases. 0 templates. The engine doesn't choose
                        aesthetics—it computes them from first principles.
                    </p>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.num} className="group relative flex flex-col cursor-crosshair">
                                {/* Connector line between cards */}
                                <div className="absolute top-10 left-full w-6 z-10 hidden lg:block"
                                    style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />

                                {/* Icon block */}
                                <div className="h-24 flex items-center justify-center mb-6 relative"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: 'var(--edge-radius)',
                                        background: 'rgba(255,255,255,0.02)',
                                        transition: 'all 0.3s var(--genome-easing)',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-dim)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                                    }}
                                >
                                    <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                                    <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest"
                                        style={{ color: 'rgba(255,255,255,0.2)' }}>{step.num}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <span className="dna-label mb-1" style={{ color: 'var(--color-primary)', opacity: 0.7 }}>
                                        {step.subtitle}
                                    </span>
                                    <h3 className="font-display font-bold uppercase text-white text-sm tracking-wider mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="font-mono text-[11px] leading-relaxed flex-1"
                                        style={{ color: 'rgba(255,255,255,0.38)' }}>
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
