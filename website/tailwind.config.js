/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#7f93c9',
                    hue: 224,
                },
                background: '#f5f5f5',
                surface: '#ffffff',
            },
            fontFamily: {
                display: ['Space Mono', 'JetBrains Mono', 'monospace'],
                body: ['IBM Plex Mono', 'Courier', 'monospace'],
            },
            spacing: {
                'genome-unit': '16px',
            },
            borderRadius: {
                'genome': '9px',
                'none': '0px',
            },
            transitionTimingFunction: {
                'genome': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            transitionDuration: {
                'genome': '376ms',
            },
        },
    },
    plugins: [],
    corePlugins: {},
};

/*
Design Genome DNA: 2f51eec6c7043eedf0fc9f69a4181997b79e0f7c792e8389c1faf478b1a46c30
Viability Score: 1
Traits: {"informationDensity":0.7,"temporalUrgency":0.8,"emotionalTemperature":0.6,"playfulness":0.9,"spatialDependency":0.8}
Topology: radial | Grid: masonry | Motion: spring | FX: fluid_mesh | Material: glass | Biomarker: organic
Generated: Permutations V3 - Biological Planetary Adaptation System
*/
