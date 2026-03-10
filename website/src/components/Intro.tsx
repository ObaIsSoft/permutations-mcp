import { ArrowRight, Zap } from 'lucide-react';
import { Procedural3D } from './Procedural3D';

interface Genome {
    chromosomes: {
        ch18_rendering: { primary: string; fallback: string; animate: boolean; complexity: string; };
        ch7_edge: { radius: number; };
        ch5_color_primary: { hue: number; saturation: number; lightness: number };
        ch13_atmosphere: { fx: string; intensity: number };
        ch15_biomarker: { geometry: string };
    };
    dnaHash: string;
}

export function Intro({ genome }: { genome: Genome }) {
    const hue = genome.chromosomes.ch5_color_primary.hue;
    const sat = Math.round(genome.chromosomes.ch5_color_primary.saturation * 100);
    const light = Math.round(genome.chromosomes.ch5_color_primary.lightness * 100);
    const primaryHsl = `hsl(${hue}, ${sat}%, ${light}%)`;
    const r = genome.chromosomes.ch7_edge.radius;

    return (
        <section
            className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden fx-atmosphere"
            style={{ background: 'var(--color-bg)' }}
        >
            {/* Ambient grid lines */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(${primaryHsl}08 1px, transparent 1px), linear-gradient(90deg, ${primaryHsl}08 1px, transparent 1px)`,
                backgroundSize: '80px 80px',
            }} />

            {/* 3D organism — right side */}
            <div className="absolute right-0 top-0 w-[55vw] h-full z-0 opacity-70 pointer-events-none">
                <Procedural3D strategy={genome.chromosomes.ch18_rendering} />
            </div>

            {/* Gradient mask — blends 3D into content */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `linear-gradient(90deg, var(--color-bg) 40%, transparent 75%, var(--color-bg) 100%)`,
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 pt-32 pb-24">

                {/* DNA beacon */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="live-badge flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: primaryHsl }}>
                        Permutations Engine · DNA Active
                    </div>
                    <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${primaryHsl}, transparent)` }} />
                </div>

                {/* Hero headline */}
                <h1 className="font-display font-bold uppercase leading-[0.88] mb-8 max-w-4xl"
                    style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', letterSpacing: '-0.03em' }}>
                    <span className="block" style={{ color: primaryHsl }}>Life</span>
                    <span className="block text-white">Adapts.</span>
                    <span className="block" style={{ color: 'rgba(255,255,255,0.35)' }}>Slop</span>
                    <span className="block text-white">Doesn't.</span>
                </h1>

                {/* Manifesto line */}
                <div className="flex items-start gap-4 mb-12 max-w-2xl">
                    <div className="w-px h-20 mt-1 flex-shrink-0" style={{ background: primaryHsl }} />
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)' }}>
                        A template is a dead organism. Permutations intercepts AI code generation
                        and forces it to evolve mathematically unique design systems—
                        adapted to your content, not copied from a pattern library.
                    </p>
                </div>

                {/* CTA row */}
                <div className="flex flex-wrap gap-4 items-center mb-16">
                    <a href="#docs" className="dna-btn" style={{ borderRadius: `${r}px` }}>
                        Initialize Engine <ArrowRight size={14} />
                    </a>
                    <a href="#manifesto" className="dna-btn-ghost" style={{ borderRadius: `${r}px` }}>
                        Read Manifesto
                    </a>
                </div>

                {/* Stats strip */}
                <div className="flex flex-wrap gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                        { val: '18', label: 'Chromosomes' },
                        { val: 'SHA-256', label: 'Hash Function' },
                        { val: genome.chromosomes.ch15_biomarker.geometry, label: 'Biomarker' },
                        { val: genome.dnaHash.slice(0, 8), label: 'Current DNA' },
                    ].map(({ val, label }) => (
                        <div key={label}>
                            <div className="font-display font-bold text-xl mb-0.5" style={{ color: primaryHsl }}>{val}</div>
                            <div className="dna-label">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom scan line */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${primaryHsl}40, transparent)` }} />
        </section>
    );
}
