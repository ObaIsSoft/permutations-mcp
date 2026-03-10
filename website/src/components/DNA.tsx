import { useEffect, useState } from 'react';
import { Fingerprint, Database, Zap } from 'lucide-react';

interface Genome {
    dnaHash: string;
    traits: {
        informationDensity: number;
        temporalUrgency: number;
        emotionalTemperature: number;
        playfulness: number;
        spatialDependency: number;
    };
    viabilityScore?: number;
    constraints?: { bondingRules: string[] };
    chromosomes: {
        ch1_structure: { topology: string };
        ch3_type_display: { family: string; charge: string; weight: number };
        ch4_type_body: { family: string; xHeightRatio: number; contrast: number };
        ch5_color_primary: { hue: number; saturation: number; lightness: number };
        ch7_edge: { radius: number };
        ch8_motion: { physics: string; durationScale: number };
        ch9_grid: { logic: string };
        ch12_signature: { entropy: number; uniqueMutation: string };
        ch13_atmosphere: { fx: string; intensity: number };
        ch14_physics: { material: string };
        ch15_biomarker: { geometry: string; complexity: number };
    };
}

export function DNA() {
    const [genome, setGenome] = useState<Genome | null>(null);

    useEffect(() => {
        fetch('/genome.json').then(r => r.json()).then(setGenome).catch(() => { });
    }, []);

    if (!genome) return (
        <section id="engine" className="w-full py-24 px-6" style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-7xl mx-auto flex items-center gap-3">
                <div className="w-px h-16" style={{ background: 'var(--color-primary)' }} />
                <span className="dna-label" style={{ color: 'var(--color-primary)' }}>Sequencing DNA…</span>
            </div>
        </section>
    );

    const ch = genome.chromosomes;
    const hue = ch.ch5_color_primary.hue;
    const sat = Math.round(ch.ch5_color_primary.saturation * 100);
    const lit = Math.round(ch.ch5_color_primary.lightness * 100);
    const primary = `hsl(${hue}, ${sat}%, ${lit}%)`;
    const primaryDim = `hsla(${hue}, ${sat}%, ${lit}%, 0.1)`;

    const traitRows = [
        { label: 'InformationDensity', val: genome.traits.informationDensity },
        { label: 'TemporalUrgency', val: genome.traits.temporalUrgency },
        { label: 'EmotionalTemp', val: genome.traits.emotionalTemperature },
        { label: 'Playfulness', val: genome.traits.playfulness },
        { label: 'SpatialDependency', val: genome.traits.spatialDependency },
    ];

    const chromosomeRows = [
        { k: 'Topology', v: ch.ch1_structure.topology },
        { k: 'Grid', v: ch.ch9_grid.logic },
        { k: 'Motion', v: ch.ch8_motion.physics },
        { k: 'FX', v: ch.ch13_atmosphere.fx },
        { k: 'Material', v: ch.ch14_physics.material },
        { k: 'Biomarker', v: ch.ch15_biomarker.geometry },
    ];

    return (
        <section id="engine" className="w-full py-24 md:py-32 px-6 md:px-12 relative"
            style={{ background: 'var(--color-bg)' }}>
            {/* Faint horizontal rule */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${primary}30, transparent)` }} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '24px' }}>
                    <div className="flex items-center gap-3">
                        <Fingerprint size={28} style={{ color: primary }} />
                        <h2 className="font-display font-bold uppercase text-white"
                            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
                            The Parametric DNA
                        </h2>
                    </div>
                    <div className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Signature: <span style={{ color: primary }}>{ch.ch12_signature.uniqueMutation}</span>
                        &nbsp;·&nbsp;
                        Viability: {Math.round((genome.viabilityScore ?? 1) * 100)}%
                    </div>
                </div>

                {/* Main 3-column grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* Block A: Hash Matrix */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <div className="flex-1 p-6 flex flex-col justify-between"
                            style={{
                                background: 'var(--color-surface)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 'var(--edge-radius)',
                            }}>
                            <div>
                                <div className="flex items-center gap-2 mb-5"
                                    style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <Database size={16} style={{ color: primary }} />
                                    <span className="dna-label" style={{ color: primary }}>01 / Hash Matrix</span>
                                </div>
                                <p className="font-mono text-[11px] leading-relaxed mb-6"
                                    style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    Deterministic SHA-256 cryptography ensures absolute consistency.
                                    Same seed yields identical DNA forever.
                                </p>
                            </div>
                            <div>
                                <div className="dna-label mb-2 flex items-center gap-2">
                                    <Zap size={10} style={{ color: primary }} />
                                    Current DNA Output
                                </div>
                                <div className="font-mono text-[10px] break-all p-4 leading-relaxed"
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        border: `1px solid ${primaryDim}`,
                                        borderRadius: '4px',
                                        color: primary,
                                        borderLeft: `3px solid ${primary}`,
                                    }}>
                                    {genome.dnaHash}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block B: Semantic Vectors */}
                    <div className="lg:col-span-5 p-6 relative flex flex-col"
                        style={{
                            background: 'var(--color-surface-elevated)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 'var(--edge-radius)',
                        }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold uppercase tracking-wider"
                                style={{ color: primary, fontSize: '1rem' }}>
                                Semantic Vectors
                            </h3>
                            <div className="live-badge dna-label" style={{ color: primary }}>Live</div>
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            {traitRows.map(({ label, val }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <span className="font-mono text-[11px] w-40 flex-shrink-0"
                                        style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                                    <div className="flex-1 h-px relative"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <div className="absolute top-0 left-0 h-full"
                                            style={{
                                                width: `${val * 100}%`,
                                                background: `linear-gradient(90deg, ${primary}, ${primaryDim})`,
                                                transition: 'width 0.8s var(--genome-easing)',
                                            }} />
                                    </div>
                                    <span className="font-mono text-[11px] w-8 text-right font-bold"
                                        style={{ color: primary }}>{val.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bonding rules */}
                        {genome.constraints?.bondingRules && genome.constraints.bondingRules.length > 0 && (
                            <div className="mt-6 p-4"
                                style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    borderLeft: `2px solid ${primary}`,
                                    borderRadius: '0 4px 4px 0',
                                }}>
                                <div className="dna-label mb-2" style={{ color: primary }}>Bonding Rules</div>
                                {genome.constraints.bondingRules.slice(0, 3).map((rule, i) => (
                                    <div key={i} className="font-mono text-[10px] leading-relaxed mb-1"
                                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        ↳ {rule.slice(0, 90)}{rule.length > 90 ? '…' : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Block C: Chromosome readout */}
                    <div className="lg:col-span-3 p-6 flex flex-col justify-between"
                        style={{
                            background: primaryDim,
                            border: `1px solid ${primary}30`,
                            borderRadius: 'var(--edge-radius)',
                        }}>
                        <div>
                            {chromosomeRows.map(({ k, v }) => (
                                <div key={k} className="data-row">
                                    <span className="dna-label">{k}</span>
                                    <span className="font-display font-bold uppercase text-xs text-white tracking-wider">{v}</span>
                                </div>
                            ))}
                        </div>
                        <h3 className="font-display font-bold uppercase leading-[1] mt-8 text-white"
                            style={{ fontSize: 'clamp(1.3rem, 2vw, 1.9rem)' }}>
                            18<br />Chromosomes.<br />
                            <span style={{ color: primary }}>{ch.ch15_biomarker.geometry}</span><br />
                            Organism.
                        </h3>
                    </div>

                    {/* Block D: Tailwind output */}
                    <div className="lg:col-span-12 mt-2"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 'var(--edge-radius)',
                            overflow: 'hidden',
                        }}>
                        {/* Terminal chrome */}
                        <div className="flex items-center justify-between px-5 py-3"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#ff5f57' }} />
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#febc2e' }} />
                                    <div className="w-2 h-2 rounded-full" style={{ background: '#28c840' }} />
                                </div>
                                <span className="dna-label">Generated Output: tailwind.config.js</span>
                            </div>
                            <span className="font-mono text-[9px] px-2 py-1 uppercase tracking-widest"
                                style={{ color: primary, border: `1px solid ${primary}30`, borderRadius: '3px' }}>
                                tailwind.config.js
                            </span>
                        </div>
                        <pre className="p-5 font-mono text-[11px] overflow-x-auto leading-relaxed"
                            style={{ color: primary, background: 'rgba(0,0,0,0.3)' }}>
                            <code>{`{
  "colors": {
    "primary": {
      "DEFAULT": "hsl(${hue}, ${sat}%, ${lit}%)",
      "hue": ${hue}
    },
    "background": "#080808",
    "surface": "#111111"
  },
  "fontFamily": {
    "display": ["${ch.ch3_type_display.family.split(',')[0].trim()}"],
    "body": ["${ch.ch4_type_body.family.split(',')[0].trim()}"]
  },
  "borderRadius": { "genome": "${ch.ch7_edge.radius}px" },
  "transitionTimingFunction": { "genome": "${ch.ch8_motion.physics === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : ch.ch8_motion.physics === 'step' ? 'steps(8)' : 'ease-out'}" },
  "transitionDuration": { "genome": "${Math.round(ch.ch8_motion.durationScale * 1000)}ms" }
}`}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </section>
    );
}
