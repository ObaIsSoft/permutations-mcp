/**
 * Genome Chromosome Tracking (FIX 9: Modularized from server.ts)
 *
 * Tracks L1 (Design), L2 (Ecosystem), L3 (Civilization) chromosome utilization
 */
// L1 Design Genome: chromosomes (ch0–ch34, some with sub-chromosomes)
const CHROMOSOME_REGISTRY = [
    'ch0_sector_primary', 'ch0_sector_secondary', 'ch0_sub_sector', 'ch0_brand_weight',
    'ch1_structure', 'ch2_rhythm', 'ch3_type_display', 'ch4_type_body',
    'ch5_color_primary', 'ch6_color_temp', 'ch7_edge', 'ch8_motion',
    'ch9_grid', 'ch10_hierarchy', 'ch11_texture', 'ch12_signature',
    'ch13_atmosphere', 'ch14_physics', 'ch15_biomarker', 'ch16_typography',
    'ch17_accessibility', 'ch18_rendering', 'ch19_hero_type', 'ch19_hero_variant_detail',
    'ch20_visual_treatment', 'ch21_trust_signals', 'ch21_trust_content',
    'ch22_social_proof', 'ch22_impact_demonstration',
    'ch23_content_depth', 'ch23_information_architecture',
    'ch24_personalization', 'ch25_copy_engine',
    'ch26_color_system', 'ch27_motion_choreography', 'ch28_iconography',
    'ch29_copy_intelligence',
    'ch30_state_topology', 'ch31_routing_pattern', 'ch32_token_inheritance',
    'ch33_composition_strategy', 'ch34_component_topology'
];
// L2 Ecosystem Genome: 12 chromosomes
const ECOSYSTEM_CHROMOSOME_REGISTRY = [
    'eco_ch1_biome', 'eco_ch2_energy', 'eco_ch3_symbiosis', 'eco_ch4_trophic',
    'eco_ch5_succession', 'eco_ch6_adaptation', 'eco_ch7_population', 'eco_ch8_temporal',
    'eco_ch9_spatial', 'eco_ch10_capacity', 'eco_ch11_mutation', 'eco_ch12_expressiveness'
];
// L3 Civilization Genome: 16 chromosomes
const CIVILIZATION_CHROMOSOME_REGISTRY = [
    'civ_ch1_archetype', 'civ_ch2_governance', 'civ_ch3_economics', 'civ_ch4_technology',
    'civ_ch5_culture', 'civ_ch6_resilience', 'civ_ch7_knowledge', 'civ_ch8_expansion',
    'civ_ch9_age', 'civ_ch10_fragility', 'civ_ch11_topology', 'civ_ch12_cosmos',
    'civ_ch13_memory', 'civ_ch14_interface', 'civ_ch15_evolution', 'civ_ch16_communication'
];
/**
 * Create L1 Design Genome chromosome tracker
 */
export function createChromosomeAccessTracker(genome) {
    const accessed = new Set();
    const available = new Set(CHROMOSOME_REGISTRY);
    // Pre-track chromosomes that exist in the genome
    if (genome?.chromosomes) {
        for (const key of Object.keys(genome.chromosomes)) {
            if (available.has(key)) {
                accessed.add(key);
            }
        }
    }
    return {
        track: (chromosome) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = [...accessed].sort();
            const unused = [...available].filter(ch => !accessed.has(ch)).sort();
            const utilizationRate = Math.round((used.length / available.size) * 100);
            let warning = null;
            if (utilizationRate < 70) {
                warning = `Low L1 utilization: ${utilizationRate}% (${used.length}/${available.size} chromosomes). Consider using more genome chromosomes in your implementation.`;
            }
            return { used, unused, utilizationRate, warning };
        }
    };
}
/**
 * Create L2 Ecosystem chromosome tracker
 */
export function createEcosystemChromosomeTracker() {
    const accessed = new Set();
    const available = new Set(ECOSYSTEM_CHROMOSOME_REGISTRY);
    return {
        track: (chromosome) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = [...accessed].sort();
            const unused = [...available].filter(ch => !accessed.has(ch)).sort();
            const utilizationRate = Math.round((used.length / available.size) * 100);
            let warning = null;
            if (utilizationRate < 50) {
                warning = `Low L2 utilization: ${utilizationRate}% (${used.length}/${available.size} ecosystem chromosomes).`;
            }
            return { used, unused, utilizationRate, warning };
        }
    };
}
/**
 * Create L3 Civilization chromosome tracker
 */
export function createCivilizationChromosomeTracker() {
    const accessed = new Set();
    const available = new Set(CIVILIZATION_CHROMOSOME_REGISTRY);
    return {
        track: (chromosome) => {
            accessed.add(chromosome);
        },
        getReport: () => {
            const used = [...accessed].sort();
            const unused = [...available].filter(ch => !accessed.has(ch)).sort();
            const utilizationRate = Math.round((used.length / available.size) * 100);
            let warning = null;
            if (utilizationRate < 40) {
                warning = `Low L3 utilization: ${utilizationRate}% (${used.length}/${available.size} civilization chromosomes).`;
            }
            return { used, unused, utilizationRate, warning };
        }
    };
}
/**
 * Combined tracker for all 3 layers (L1 + L2 + L3 = 60 chromosomes)
 */
export function createFullGenomeTracker(genome, ecosystemGenome, civilizationGenome) {
    const l1 = createChromosomeAccessTracker(genome);
    const l2 = ecosystemGenome ? createEcosystemChromosomeTracker() : null;
    const l3 = civilizationGenome ? createCivilizationChromosomeTracker() : null;
    return {
        trackL1: (ch) => l1.track(ch),
        trackL2: (ch) => l2?.track(ch),
        trackL3: (ch) => l3?.track(ch),
        getFullReport: () => {
            const r1 = l1.getReport();
            const r2 = l2?.getReport() ?? { used: [], unused: [], utilizationRate: 0, warning: null };
            const r3 = l3?.getReport() ?? { used: [], unused: [], utilizationRate: 0, warning: null };
            const totalUsed = r1.used.length + r2.used.length + r3.used.length;
            const totalAvailable = CHROMOSOME_REGISTRY.length +
                (ecosystemGenome ? ECOSYSTEM_CHROMOSOME_REGISTRY.length : 0) +
                (civilizationGenome ? CIVILIZATION_CHROMOSOME_REGISTRY.length : 0);
            const overallRate = Math.round((totalUsed / totalAvailable) * 100);
            let layerWarning = null;
            if (r1.warning || r2.warning || r3.warning) {
                layerWarning = [r1.warning, r2.warning, r3.warning].filter(Boolean).join(' | ');
            }
            return { L1: r1, L2: r2, L3: r3, totalUsed, totalAvailable, overallRate, layerWarning };
        }
    };
}
export { CHROMOSOME_REGISTRY, ECOSYSTEM_CHROMOSOME_REGISTRY, CIVILIZATION_CHROMOSOME_REGISTRY };
