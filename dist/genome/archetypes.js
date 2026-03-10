export const ARCHETYPES = {
    dashboard: {
        name: "Departure Board",
        description: "High-velocity data scanning with zero learning curve",
        constraints: {
            minInformationDensity: 0.7,
            maxInformationDensity: 0.95,
            preferredTopology: "flat",
            forbiddenFonts: ["script", "decorative", "humanist"],
            requiredCharge: "monospace",
            motionPreference: "none",
            edgePreference: "sharp",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "high_frequency_data",
                updateFrequency: "realtime",
                itemCount: 50,
                chronology: false,
                taxonomy: true,
            },
            textMarkers: {
                averageWordLength: 4,
                textVolume: "minimal",
                hierarchyDepth: 2,
                contentTone: "technical",
                scanVsReadRatio: 0.9,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "neutral",
                textureProfile: "smooth",
                imageAspectRatios: [],
                visualDensity: "dense",
            },
        },
    },
    portfolio: {
        name: "Gallery",
        description: "Visual-first presentation with narrative depth",
        constraints: {
            minInformationDensity: 0.2,
            maxInformationDensity: 0.6,
            preferredTopology: "deep",
            forbiddenFonts: ["monospace"],
            requiredCharge: null,
            motionPreference: "spring",
            edgePreference: "soft",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "portfolio",
                updateFrequency: "static",
                itemCount: 12,
                chronology: true,
                taxonomy: true,
            },
            textMarkers: {
                averageWordLength: 6,
                textVolume: "medium",
                hierarchyDepth: 3,
                contentTone: "narrative",
                scanVsReadRatio: 0.3,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "neutral",
                textureProfile: "grainy",
                imageAspectRatios: ["landscape", "portrait"],
                visualDensity: "medium",
            },
        },
    },
    documentation: {
        name: "Monastic Library",
        description: "Long-form reading with comprehension focus",
        constraints: {
            minInformationDensity: 0.3,
            maxInformationDensity: 0.7,
            preferredTopology: "deep",
            forbiddenFonts: ["monospace", "geometric"],
            requiredCharge: "humanist",
            motionPreference: "none",
            edgePreference: "soft",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "long_form",
                updateFrequency: "static",
                itemCount: 100,
                chronology: false,
                taxonomy: true,
            },
            textMarkers: {
                averageWordLength: 6,
                textVolume: "extensive",
                hierarchyDepth: 4,
                contentTone: "technical",
                scanVsReadRatio: 0.1,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "warm",
                textureProfile: "smooth",
                imageAspectRatios: [],
                visualDensity: "sparse",
            },
        },
    },
    commerce: {
        name: "Bazaar",
        description: "Discovery-driven browsing with emotional persuasion",
        constraints: {
            minInformationDensity: 0.4,
            maxInformationDensity: 0.8,
            preferredTopology: "graph",
            forbiddenFonts: ["monospace"],
            requiredCharge: null,
            motionPreference: "spring",
            edgePreference: "organic",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "commerce",
                updateFrequency: "periodic",
                itemCount: 200,
                chronology: false,
                taxonomy: true,
            },
            textMarkers: {
                averageWordLength: 5,
                textVolume: "medium",
                hierarchyDepth: 3,
                contentTone: "commercial",
                scanVsReadRatio: 0.6,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "warm",
                textureProfile: "smooth",
                imageAspectRatios: ["square"],
                visualDensity: "dense",
            },
        },
    },
    landing: {
        name: "Ritual Space",
        description: "Conversion-focused with sequential revelation",
        constraints: {
            minInformationDensity: 0.2,
            maxInformationDensity: 0.5,
            preferredTopology: "radial",
            forbiddenFonts: ["monospace"],
            requiredCharge: "geometric",
            motionPreference: "spring",
            edgePreference: "soft",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "long_form",
                updateFrequency: "static",
                itemCount: 5,
                chronology: true,
                taxonomy: false,
            },
            textMarkers: {
                averageWordLength: 5,
                textVolume: "minimal",
                hierarchyDepth: 2,
                contentTone: "commercial",
                scanVsReadRatio: 0.5,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "neutral",
                textureProfile: "smooth",
                imageAspectRatios: ["landscape"],
                visualDensity: "sparse",
            },
        },
    },
    blog: {
        name: "Periodical",
        description: "Chronological content with reading optimization",
        constraints: {
            minInformationDensity: 0.3,
            maxInformationDensity: 0.6,
            preferredTopology: "deep",
            forbiddenFonts: ["monospace", "geometric"],
            requiredCharge: "transitional",
            motionPreference: "none",
            edgePreference: "soft",
        },
        epigeneticMarkers: {
            structuralMarkers: {
                contentType: "long_form",
                updateFrequency: "periodic",
                itemCount: 50,
                chronology: true,
                taxonomy: true,
            },
            textMarkers: {
                averageWordLength: 6,
                textVolume: "extensive",
                hierarchyDepth: 3,
                contentTone: "narrative",
                scanVsReadRatio: 0.2,
                keywords: [],
                entities: [],
            },
            visualMarkers: {
                dominantColors: [],
                colorTemperature: "neutral",
                textureProfile: "grainy",
                imageAspectRatios: ["landscape"],
                visualDensity: "medium",
            },
        },
    },
};
export function detectArchetype(intent) {
    const intentLower = intent.toLowerCase();
    // Direct keyword matching
    if (intentLower.includes("dashboard") || intentLower.includes("admin") || intentLower.includes("analytics")) {
        return "dashboard";
    }
    if (intentLower.includes("portfolio") || intentLower.includes("agency") || intentLower.includes("showcase")) {
        return "portfolio";
    }
    if (intentLower.includes("docs") || intentLower.includes("documentation") || intentLower.includes("guide")) {
        return "documentation";
    }
    if (intentLower.includes("shop") || intentLower.includes("store") || intentLower.includes("ecommerce") || intentLower.includes("commerce")) {
        return "commerce";
    }
    if (intentLower.includes("landing") || intentLower.includes("marketing") || intentLower.includes("conversion")) {
        return "landing";
    }
    if (intentLower.includes("blog") || intentLower.includes("journal") || intentLower.includes("magazine")) {
        return "blog";
    }
    return null;
}
export function getArchetype(name) {
    return ARCHETYPES[name] || null;
}
export function listArchetypes() {
    return Object.keys(ARCHETYPES);
}
