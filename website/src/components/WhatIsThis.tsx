export function WhatIsThis() {
    const problems = [
        "Inter font on everything",
        "Blue-purple linear gradients",
        "Rounded card borders",
        "Generic hero sections",
        "Cookie-cutter animations",
        "Identical spacing rhythm",
    ];

    const chromosomes = [
        { id: 'ch1', name: 'Topology', desc: 'Layout skeleton — flat, deep, radial, or graph network' },
        { id: 'ch5', name: 'Color', desc: 'Primary hue derived from SHA-256 byte 10 × intent temperature' },
        { id: 'ch8', name: 'Motion', desc: 'Physics — none, spring, step, or glitch. Not chosen. Computed.' },
        { id: 'ch13', name: 'Atmosphere', desc: 'Glassmorphism, CRT noise, fluid mesh, or static void' },
        { id: 'ch14', name: 'Material', desc: '3D surface — glass, metallic, neumorphism, matte' },
        { id: 'ch15', name: 'Biomarker', desc: 'Procedural SVG mark — organic bezier, fractal polygon, or P-form' },
    ];

    return (
        <section className="w-full py-24 md:py-36 px-6 md:px-12" style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-7xl mx-auto">

                {/* Top: Problem statement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 items-start">
                    <div>
                        <div className="section-line" />
                        <p className="dna-label mb-4">The Problem</p>
                        <h2 className="font-display font-bold uppercase leading-[0.9] text-white mb-8"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
                            Every AI Site<br />Looks Identical
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '46ch' }}>
                            LLMs trained on the same pattern libraries produce the same output.
                            They interpolate toward the mean. Your design system looks like your competitor's
                            because they used the same AI with the same vibe prompt.
                        </p>
                    </div>

                    {/* Problem list – crossed out */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {problems.map((p) => (
                            <div key={p} className="flex items-center gap-3 p-4"
                                style={{
                                    background: 'rgba(255,0,0,0.03)',
                                    border: '1px solid rgba(255,0,0,0.1)',
                                    borderRadius: 'var(--edge-radius)'
                                }}>
                                <span style={{ color: 'rgba(255,60,60,0.6)', fontSize: 18, lineHeight: 1 }}>×</span>
                                <span className="font-mono text-xs line-through" style={{ color: 'rgba(255,255,255,0.35)', textDecorationColor: 'rgba(255,60,60,0.4)' }}>{p}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom: Chromosome showcase */}
                <div>
                    <div className="flex items-center gap-4 mb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                        <p className="dna-label">The Solution — 18 Chromosomes</p>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span className="font-mono text-[10px] text-primary opacity-70 uppercase tracking-widest">Math, not opinion</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chromosomes.map((ch, i) => (
                            <div key={ch.id} className="dna-card p-6 group cursor-crosshair">
                                <div className="flex items-start justify-between mb-4">
                                    <span className="font-mono text-[10px] tracking-widest uppercase text-primary opacity-60">{ch.id}</span>
                                    <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold uppercase text-white text-sm tracking-wider mb-2
                                    group-hover:text-primary transition-colors" style={{ transitionDuration: '0.2s' }}>
                                    {ch.name}
                                </h3>
                                <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                    {ch.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
