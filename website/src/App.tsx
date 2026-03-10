import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Intro } from './components/Intro';
import { WhatIsThis } from './components/WhatIsThis';
import { DNA } from './components/DNA';
import { Installation } from './components/Installation';
import { Architecture } from './components/Architecture';
import { Footer } from './components/Footer';

// Google Fonts map — all fonts the sequencer can emit
const FONT_GOOGLE_URLS: Record<string, string> = {
    'Space Mono': 'Space+Mono:ital,wght@0,400;0,700;1,400;1,700',
    'Space Grotesk': 'Space+Grotesk:wght@300;400;500;700',
    'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;700',
    'Syne': 'Syne:wght@400;500;700;800',
    'Fraunces': 'Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,700;9..144,0,900;9..144,1,700',
    'Merriweather': 'Merriweather:ital,wght@0,300;0,400;0,700;1,400',
    'Bebas Neue': 'Bebas+Neue',
    'DM Sans': 'DM+Sans:wght@300;400;500;700',
    'JetBrains Mono': 'JetBrains+Mono:wght@400;700',
    'Outfit': 'Outfit:wght@300;400;600;700',
    'Inter': 'Inter:wght@300;400;500;700',
    'Bricolage Grotesque': 'Bricolage+Grotesque:wght@400;500;700;800',
};

function loadGoogleFont(family: string) {
    const key = Object.keys(FONT_GOOGLE_URLS).find(k => family.includes(k));
    if (!key) return;
    const exists = document.querySelector(`link[data-genome-font="${key}"]`);
    if (exists) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-genome-font', key);
    link.href = `https://fonts.googleapis.com/css2?family=${FONT_GOOGLE_URLS[key]}&display=swap`;
    document.head.appendChild(link);
}

// Genome type — all chromosomes used in the rebuilt components
interface Genome {
    dnaHash: string;
    viabilityScore?: number;
    traits?: { playfulness: number; spatialDependency: number };
    constraints?: { bondingRules: string[]; forbiddenPatterns: string[]; requiredPatterns: string[] };
    chromosomes: {
        ch1_structure: { topology: string };
        ch3_type_display: { charge: string; family: string; weight: number };
        ch4_type_body: { family: string; xHeightRatio: number; contrast: number };
        ch5_color_primary: { hue: number; saturation: number; lightness: number; temperature: string };
        ch6_color_temp: { backgroundTemp: string; contrastRatio: number };
        ch7_edge: { radius: number; style: string };
        ch8_motion: { physics: string; durationScale: number };
        ch9_grid: { logic: string };
        ch12_signature: { entropy: number; uniqueMutation: string };
        ch13_atmosphere: { fx: string; intensity: number };
        ch14_physics: { material: string };
        ch15_biomarker: { geometry: string; complexity: number };
        ch18_rendering: { primary: string; fallback: string; animate: boolean; complexity: string };
    };
}


function App() {
    const [genome, setGenome] = useState<Genome | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the genome from the JSON file
        fetch('/genome.json')
            .then(res => res.json())
            .then(data => {
                setGenome(data);
                setLoading(false);

                // ================================================================
                // CRITICAL: Inject all genome chromosome values into CSS variables
                // so the site actually renders the mathematically generated design
                // ================================================================
                const root = document.documentElement;
                const ch = data.chromosomes;

                // Color chromosome (ch5/ch6)
                if (ch.ch5_color_primary) {
                    root.style.setProperty('--primary-hue', String(ch.ch5_color_primary.hue));
                    root.style.setProperty('--primary-sat', `${Math.round(ch.ch5_color_primary.saturation * 100)}%`);
                    root.style.setProperty('--primary-light', `${Math.round(ch.ch5_color_primary.lightness * 100)}%`);
                }

                // Edge chromosome (ch7)
                if (ch.ch7_edge) {
                    root.style.setProperty('--edge-radius', `${ch.ch7_edge.radius}px`);
                }

                // Typography/font chromosome (ch3/ch4)
                if (ch.ch3_type_display?.family) {
                    const displayFont = ch.ch3_type_display.family.split(',')[0].trim();
                    root.style.setProperty('--font-display', `'${displayFont}'`);
                }
                if (ch.ch4_type_body?.family) {
                    const bodyFont = ch.ch4_type_body.family.split(',')[0].trim();
                    root.style.setProperty('--font-body', `'${bodyFont}'`);
                }

                // Motion chromosome (ch8)
                if (ch.ch8_motion) {
                    const easing = ch.ch8_motion.physics === 'spring'
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        : ch.ch8_motion.physics === 'step'
                            ? 'steps(8)'
                            : 'cubic-bezier(0.4, 0, 0.2, 1)';
                    root.style.setProperty('--genome-easing', easing);
                    root.style.setProperty('--genome-duration', `${Math.round((ch.ch8_motion.durationScale ?? 0.5) * 1000)}ms`);
                }

                // Spacing chromosome (ch2)
                if (ch.ch2_rhythm?.baseSpacing) {
                    root.style.setProperty('--genome-spacing', `${ch.ch2_rhythm.baseSpacing}px`);
                }

                // Typography scale (ch16)
                if (ch.ch16_typography) {
                    const t = ch.ch16_typography;
                    if (t.display?.size) root.style.setProperty('--genome-size-display', t.display.size);
                    if (t.h1?.size) root.style.setProperty('--genome-size-h1', t.h1.size);
                    if (t.h2?.size) root.style.setProperty('--genome-size-h2', t.h2.size);
                    if (t.h3?.size) root.style.setProperty('--genome-size-h3', t.h3.size);
                    if (t.body?.size) root.style.setProperty('--genome-size-body', t.body.size);
                }

                // Atmosphere chromosome (ch13)
                if (ch.ch13_atmosphere?.intensity !== undefined) {
                    root.style.setProperty('--genome-blur', `${Math.round(10 + ch.ch13_atmosphere.intensity * 30)}px`);
                    root.style.setProperty('--genome-intensity', String(ch.ch13_atmosphere.intensity));
                }
                // Also load the fonts dynamically via Google Fonts
                if (ch.ch3_type_display?.family) loadGoogleFont(ch.ch3_type_display.family);
                if (ch.ch4_type_body?.family) loadGoogleFont(ch.ch4_type_body.family);
            })
            .catch(() => {
                // Fallback genome if fetch fails — all fields fully specified
                setGenome({
                    dnaHash: '2f51eec6c7043eedf0fc9f69a4181997b79e0f7c792e8389c1faf478b1a46c30',
                    viabilityScore: 1,
                    traits: { playfulness: 0.8, spatialDependency: 0.9 },
                    constraints: { bondingRules: [], forbiddenPatterns: [], requiredPatterns: [] },
                    chromosomes: {
                        ch1_structure: { topology: 'flat' },
                        ch3_type_display: { charge: 'geometric', family: 'Space Mono, monospace', weight: 700 },
                        ch4_type_body: { family: 'Space Grotesk, sans-serif', xHeightRatio: 0.7, contrast: 0.5 },
                        ch5_color_primary: { hue: 292, saturation: 0.79, lightness: 0.71, temperature: 'neutral' },
                        ch6_color_temp: { backgroundTemp: 'cool', contrastRatio: 7 },
                        ch7_edge: { radius: 5, style: 'soft' },
                        ch8_motion: { physics: 'spring', durationScale: 0.8 },
                        ch9_grid: { logic: 'broken' },
                        ch12_signature: { entropy: 0.5, uniqueMutation: '2f51eec6' },
                        ch13_atmosphere: { fx: 'glassmorphism', intensity: 0.4 },
                        ch14_physics: { material: 'glass' },
                        ch15_biomarker: { geometry: 'organic', complexity: 0.5 },
                        ch18_rendering: { primary: 'webgl', fallback: 'css', animate: true, complexity: 'balanced' },
                    }
                });
                setLoading(false);
            });
    }, []);

    if (loading || !genome) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
                <div className="text-center">
                    <div className="w-px h-24 mx-auto mb-6" style={{ background: 'linear-gradient(to bottom, var(--color-primary), transparent)' }} />
                    <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--color-primary)', opacity: 0.7 }}>Sequencing DNA…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
            <Navbar />
            <main className="flex-1">
                <Intro genome={genome} />
                <WhatIsThis />
                <DNA />
                <Installation />
                <Architecture />
            </main>
            <Footer genome={genome} />
        </div>
    );
}

export default App;
