import { useEffect, useState } from 'react';

interface BiomarkerProps {
    geometry: 'organic' | 'fractal' | 'monolithic';
    complexity: number;
    entropy: number;
    weight: number;
}

function ProceduralBiomarkerSVG({ geometry, complexity, entropy, weight }: BiomarkerProps) {
    const strokeWidth = Math.max(2, Math.round(weight / 100));

    let innerSVG: React.ReactNode = null;

    if (geometry === 'organic') {
        const pointCount = Math.max(3, Math.round(3 + complexity * 9));
        const baseRadius = 35;
        const radiusVariance = entropy * 20;
        const cx = 50, cy = 50;
        const points: [number, number][] = [];

        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2 - Math.PI / 2;
            const perturbSeed = Math.sin(i * entropy * Math.PI * 7.3);
            const r = baseRadius + perturbSeed * radiusVariance;
            points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
        }

        let d = `M ${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
        for (let i = 0; i < points.length; i++) {
            const curr = points[i];
            const next = points[(i + 1) % points.length];
            const mid = [(curr[0] + next[0]) / 2, (curr[1] + next[1]) / 2];
            d += ` Q ${curr[0].toFixed(1)},${curr[1].toFixed(1)} ${mid[0].toFixed(1)},${mid[1].toFixed(1)}`;
        }
        d += ' Z';
        innerSVG = <path d={d} strokeLinejoin="round" />;

    } else if (geometry === 'fractal') {
        const sides = Math.max(3, Math.round(3 + complexity * 7));
        const layers = Math.max(2, Math.round(2 + entropy * 3));
        const outerRadius = 42;
        const cx = 50, cy = 50;

        const polygons = Array.from({ length: layers }, (_, layer) => {
            const r = outerRadius * (1 - (layer / layers) * 0.65);
            const rotation = (layer * Math.PI) / sides;
            const pts = Array.from({ length: sides }, (_, i) => {
                const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + rotation;
                return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
            }).join(' ');
            return <polygon key={layer} points={pts} opacity={(1 - layer * 0.15).toFixed(2)} />;
        });
        innerSVG = <>{polygons}</>;

    } else {
        // monolithic — structural P(n,r) letterform
        const stemX = 25;
        const stemTop = 8, stemBottom = 92;
        const bowlMid = stemTop + (stemBottom - stemTop) * (0.3 + complexity * 0.2);
        const bowlRight = 75 + complexity * 10;
        const bowlCy = (stemTop + bowlMid) / 2;

        innerSVG = (
            <>
                <line x1={stemX} y1={stemTop} x2={stemX} y2={stemBottom} strokeLinecap="square" />
                <line x1={stemX - 6} y1={stemTop} x2={stemX + 6} y2={stemTop} strokeLinecap="square" />
                <line x1={stemX - 6} y1={stemBottom} x2={stemX + 6} y2={stemBottom} strokeLinecap="square" />
                <path d={`M ${stemX},${stemTop} C ${stemX + 10},${stemTop} ${bowlRight - 5},${stemTop + 5} ${bowlRight - 5},${bowlCy} C ${bowlRight - 5},${bowlMid - 5} ${stemX + 10},${bowlMid} ${stemX},${bowlMid}`} strokeLinecap="square" />
                <line x1={stemX} y1={bowlMid} x2={stemX + 15} y2={bowlMid} strokeLinecap="square" />
            </>
        );
    }

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
            <g strokeWidth={strokeWidth} fill="none" stroke="currentColor">
                {innerSVG}
            </g>
        </svg>
    );
}

export function Navbar() {
    const [biomarker, setBiomarker] = useState<{
        geometry: 'organic' | 'fractal' | 'monolithic';
        complexity: number;
        entropy: number;
        weight: number;
    } | null>(null);

    useEffect(() => {
        fetch('/genome.json')
            .then(res => res.json())
            .then(data => {
                const ch = data.chromosomes;
                setBiomarker({
                    geometry: ch.ch15_biomarker?.geometry ?? 'monolithic',
                    complexity: ch.ch15_biomarker?.complexity ?? 0.5,
                    entropy: ch.ch12_signature?.entropy ?? 0.5,
                    weight: ch.ch3_type_display?.weight ?? 700,
                });
            })
            .catch(() => {
                setBiomarker({ geometry: 'monolithic', complexity: 0.5, entropy: 0.5, weight: 700 });
            });
    }, []);

    return (
        <nav className="w-full border-b-2 border-black bg-surface px-3 sm:px-4 md:px-12 py-3 sm:py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary border-2 border-black flex items-center justify-center p-0.5 sm:p-1">
                    {biomarker ? (
                        <ProceduralBiomarkerSVG {...biomarker} />
                    ) : (
                        <div className="w-full h-full animate-pulse bg-white/20" />
                    )}
                </div>
                <span className="font-display font-bold text-lg sm:text-xl uppercase tracking-tighter">PERMUTATIONS.</span>
            </div>

            <div className="flex gap-4 sm:gap-8 font-mono text-xs sm:text-sm uppercase items-center hidden md:flex">
                <a href="#manifesto" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'var(--genome-easing, cubic-bezier(0.34, 1.56, 0.64, 1))' }}>Story</a>
                <a href="#engine" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'var(--genome-easing, cubic-bezier(0.34, 1.56, 0.64, 1))' }}>The Engine</a>
                <a href="#docs" className="hover:text-primary transition-colors duration-genome" style={{ transitionTimingFunction: 'var(--genome-easing, cubic-bezier(0.34, 1.56, 0.64, 1))' }}>Docs</a>
                <a href="#docs" className="dna-btn py-1.5 sm:py-2 px-3 sm:px-4 text-[10px] sm:text-xs inline-block">
                    Initialize
                </a>
            </div>
        </nav>
    );
}
