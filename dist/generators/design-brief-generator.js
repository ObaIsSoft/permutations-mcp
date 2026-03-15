/**
 * Design Brief Generator — LLM-driven cross-layer philosophy synthesizer.
 *
 * Reads all three genome layers (L1 + optional L2 + optional L3) and asks
 * the LLM to synthesize a design philosophy from the full chromosome combination.
 *
 * Output is a creative THESIS — what organism is this design — not a token list.
 * Token application instructions are secondary to the philosophy.
 */
export class DesignBriefGenerator {
    async generate(designGenome, callText, ecosystemGenome, civilizationGenome) {
        const prompt = this.buildSynthesisPrompt(designGenome, ecosystemGenome, civilizationGenome);
        const raw = await callText(prompt);
        return this.parseResponse(raw, designGenome, ecosystemGenome, civilizationGenome);
    }
    buildSynthesisPrompt(dg, eg, cg) {
        const c = dg.chromosomes;
        const totalChromosomes = eg && cg ? 53 : eg ? 43 : 32;
        const primary = c.ch5_color_primary;
        const pHue = primary?.hue ?? 0;
        const pSat = Math.round((primary?.saturation ?? 0) * 100);
        const pLight = Math.round((primary?.lightness ?? 0) * 100);
        const pDarkLight = Math.round((primary?.darkModeLightness ?? 0) * 100);
        let prompt = `You are synthesizing a design philosophy from a ${totalChromosomes}-chromosome genome chain.

Your task is NOT to describe tokens. Your task is to describe the ORGANISM — what kind of design does this chromosome combination produce, what creative philosophy emerges from their interaction, and what it mandates and forbids.

Think epistatically: each chromosome's meaning changes in context of the others. A "volcanic biome" + "warrior archetype" produces something very different from "volcanic biome" + "democratic archetype". Read the COMBINATION, not the individual values.

═══════════════════════════════════════
LAYER 1 — DESIGN GENOME (32 chromosomes)
═══════════════════════════════════════
Sector: ${dg.sectorContext.primary} / ${dg.sectorContext.subSector}
DNA Hash: ${dg.dnaHash.slice(0, 16)}...

Structure & Space:
  ch1 topology: ${c.ch1_structure?.topology} — ${c.ch1_structure?.sectionCount} sections
  ch2 rhythm density: ${c.ch2_rhythm?.density}
  ch9 grid: ${c.ch9_grid?.columns}-column, ${c.ch9_grid?.logic} logic
  ch10 hierarchy depth: ${c.ch10_hierarchy?.depth}

Typography:
  ch3 display font: ${c.ch3_type_display?.displayName} — charge: ${c.ch3_type_display?.charge}, tracking: ${c.ch3_type_display?.tracking}
  ch4 body font: ${c.ch4_type_body?.displayName} — line length: ${c.ch4_type_body?.optimalLineLength}
  ch16 type scale ratio: ${c.ch16_typography?.ratio?.toFixed(2)}

Color & Surface:
  ch5 primary: HSL(${pHue}°, ${pSat}%, ${pLight}%) — ${primary?.temperature} — dark mode: ${pDarkLight}% lightness
  ch6 temperature: ${c.ch6_color_temp?.backgroundTemp} (dark: ${c.ch6_color_temp?.isDark})
  ch11 surface texture: ${c.ch11_texture?.surface}
  ch7 edge style: ${c.ch7_edge?.style}

Motion & Interaction:
  ch8 physics: ${c.ch8_motion?.physics} — ${c.ch8_motion?.durationScale}s duration
  ch14 animation character: ${c.ch14_animation_character?.style ?? "–"}
  ch17 accessibility: WCAG ${c.ch17_accessibility?.minContrastRatio}:1, motion-safe: ${c.ch17_accessibility?.respectMotionPreference}

Content & Trust:
  ch19 hero: ${c.ch19_hero_type?.type} — ${c.ch19_hero_variant_detail?.layout} layout
  ch21 trust signals: ${c.ch21_trust_signals?.prominence} prominence, ${c.ch21_trust_signals?.approach}
  ch22 social proof: ${c.ch22_social_proof?.type}
  ch23 content depth: ${c.ch23_content_depth?.level} (${c.ch23_content_depth?.estimatedSections} sections)
  ch29 copy: ${c.ch29_copy_intelligence?.emotionalRegister} register, ${Math.round((c.ch29_copy_intelligence?.formalityLevel ?? 0.5) * 100)}% formality

Constraints:
  Forbidden patterns: ${dg.constraints?.forbiddenPatterns?.join(", ") || "none"}
  Required patterns: ${dg.constraints?.requiredPatterns?.join(", ") || "none"}
`;
        if (eg) {
            const ec = eg.chromosomes;
            prompt += `
═══════════════════════════════════════
LAYER 2 — ECOSYSTEM GENOME (11 chromosomes)
sha256(L1 hash) — derived from L1
═══════════════════════════════════════
  eco_ch1 biome: ${ec.eco_ch1_biome.class} (intensity ${ec.eco_ch1_biome.intensity.toFixed(2)})
  eco_ch2 energy source: ${ec.eco_ch2_energy.source} (flux ${ec.eco_ch2_energy.flux.toFixed(2)})
  eco_ch3 symbiosis: ${ec.eco_ch3_symbiosis.pattern} (depth ${ec.eco_ch3_symbiosis.depth.toFixed(2)})
  eco_ch4 trophic structure: ${ec.eco_ch4_trophic.structure} (cascade ${ec.eco_ch4_trophic.cascade.toFixed(2)})
  eco_ch5 succession: ${ec.eco_ch5_succession.stage} (drift ${ec.eco_ch5_succession.drift.toFixed(2)})
  eco_ch6 adaptation axis: ${ec.eco_ch6_adaptation.axis} (strength ${ec.eco_ch6_adaptation.strength.toFixed(2)})
  eco_ch7 population: ${ec.eco_ch7_population.pattern} (variance ${ec.eco_ch7_population.variance.toFixed(2)})
  eco_ch8 temporal rhythm: ${ec.eco_ch8_temporal.rhythm} (intensity ${ec.eco_ch8_temporal.intensity.toFixed(2)})
  eco_ch9 spatial axis: ${ec.eco_ch9_spatial.axis} (isolation ${ec.eco_ch9_spatial.isolation.toFixed(2)})
  eco_ch10 capacity: ${ec.eco_ch10_capacity.class} (pressure ${ec.eco_ch10_capacity.pressure.toFixed(2)})
  eco_ch11 mutation rate: ${ec.eco_ch11_mutation.rate.toFixed(2)} (variance ${ec.eco_ch11_mutation.variance.toFixed(2)})
`;
        }
        if (cg) {
            const cc = cg.chromosomes;
            prompt += `
═══════════════════════════════════════
LAYER 3 — CIVILIZATION GENOME (10 chromosomes)
sha256(L2 hash) — derived from L2
═══════════════════════════════════════
  civ_ch1 archetype: ${cc.civ_ch1_archetype.class} (intensity ${cc.civ_ch1_archetype.intensity.toFixed(2)})
  civ_ch2 governance: ${cc.civ_ch2_governance.model} (rigidity ${cc.civ_ch2_governance.rigidity.toFixed(2)})
  civ_ch3 economics: ${cc.civ_ch3_economics.model} (pressure ${cc.civ_ch3_economics.pressure.toFixed(2)})
  civ_ch4 technology: ${cc.civ_ch4_technology.class} (maturity ${cc.civ_ch4_technology.maturity.toFixed(2)})
  civ_ch5 culture: ${cc.civ_ch5_culture.emphasis} (cohesion ${cc.civ_ch5_culture.cohesion.toFixed(2)})
  civ_ch6 resilience: ${cc.civ_ch6_resilience.pattern} (depth ${cc.civ_ch6_resilience.depth.toFixed(2)})
  civ_ch7 knowledge: ${cc.civ_ch7_knowledge.model} (entropy ${cc.civ_ch7_knowledge.entropy.toFixed(2)})
  civ_ch8 expansion: ${cc.civ_ch8_expansion.mode} (velocity ${cc.civ_ch8_expansion.velocity.toFixed(2)})
  civ_ch9 age: ${cc.civ_ch9_age.class} (stability ${cc.civ_ch9_age.stability.toFixed(2)})
  civ_ch10 fragility: ${cc.civ_ch10_fragility.rate.toFixed(2)} (variance ${cc.civ_ch10_fragility.variance.toFixed(2)})
`;
        }
        prompt += `
═══════════════════════════════════════
SYNTHESIS TASK
═══════════════════════════════════════
Read these ${totalChromosomes} chromosomes as a system. Find the tensions and alignments. What does this specific combination produce?

Return your response using EXACTLY these section headers (no extra text before ## THESIS):

## THESIS
[2-4 sentences. What kind of organism is this design? Not what tokens it has — what is its essential character? What creative philosophy emerges from THIS specific chromosome combination? Be concrete and evocative.]

## MANDATES
[Bullet list starting with -. What MUST this design implement, given these chromosomes? Be specific — reference the chromosome values. Not generic advice.]

## ANTI-PATTERNS
[Bullet list starting with -. What approaches would betray this genome? What would feel wrong for this specific organism? Reference chromosome tensions where relevant.]

## L1 IMPLEMENTATION
[How these L1 chromosomes direct the CSS/visual implementation. What does the motion physics + edge style + typography charge combination mean concretely? How should the builder read the color system for this genome?]
${eg ? `
## L2 COMPONENT PHILOSOPHY
[How the ecosystem chromosomes — biome + energy + symbiosis + trophic — shape how components should be built. What kind of organisms live in this biome? How should they relate to each other? What animation/interaction character follows from this ecosystem?]
` : ""}${cg ? `
## L3 ARCHITECTURE PHILOSOPHY
[How the civilization chromosomes — archetype + governance + economics + knowledge model — shape application architecture. State topology, routing character, resilience strategy. What does it mean to build a ${cg?.chromosomes.civ_ch1_archetype.class} civilization with ${cg?.chromosomes.civ_ch2_governance.model} governance?]
` : ""}
## USAGE.MD
[Write a complete DESIGN_SYSTEM.md for this project. Include: the thesis paragraph, a token quick-reference table (CSS variable name | purpose | do not use for), implementation mandates checklist, forbidden patterns with reason, font loading snippet, and which genome layer drives which implementation concern. Make it specific to THIS genome — not generic. The builder should read this and know exactly what kind of design organism they are building.]
`;
        return prompt;
    }
    parseResponse(raw, dg, eg, cg) {
        const extract = (section) => {
            const regex = new RegExp(`## ${section}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
            const m = raw.match(regex);
            return m ? m[1].trim() : '';
        };
        const parseBullets = (s) => s.split('\n')
            .map(l => l.replace(/^[-*•]\s*/, '').trim())
            .filter(Boolean);
        const thesis = extract('THESIS');
        const mandatesRaw = extract('MANDATES');
        const antiRaw = extract('ANTI-PATTERNS');
        const l1 = extract('L1 IMPLEMENTATION');
        const l2 = eg ? extract('L2 COMPONENT PHILOSOPHY') : undefined;
        const l3 = cg ? extract('L3 ARCHITECTURE PHILOSOPHY') : undefined;
        const usage_md_raw = extract('USAGE\\.MD');
        return {
            thesis: thesis || "Design philosophy synthesis unavailable.",
            mandates: parseBullets(mandatesRaw),
            antiPatterns: parseBullets(antiRaw),
            layerGuide: { l1, l2, l3 },
            usage_md: usage_md_raw || this.buildFallbackUsageMd(dg, thesis),
        };
    }
    buildFallbackUsageMd(dg, thesis) {
        const c = dg.chromosomes;
        return `# Design System — ${dg.sectorContext.primary}

## Philosophy
${thesis}

## Token Quick Reference
| CSS Variable | Purpose |
|---|---|
| \`--color-primary\` | Primary brand color (light mode) |
| \`--color-primary-interactive\` | Buttons and interactive elements (dark mode safe) |
| \`--color-surface-0\` | Page background |
| \`--color-surface-1\` | Card backgrounds |
| \`--color-surface-2\` | Elevated surfaces |
| \`--color-surface-3\` | Highest elevation |
| \`--genome-easing\` | All transition timing functions |
| \`--genome-duration\` | Base animation duration |

## Constraints
- **Forbidden:** ${dg.constraints?.forbiddenPatterns?.join(", ") || "none"}
- **Required:** ${dg.constraints?.requiredPatterns?.join(", ") || "none"}

## Layer Guide
- **L1 genome** → CSS variables, color system, typography, spacing, motion tokens
- **L2 ecosystemGenome** → Component hierarchy, organism relationships, biome character
- **L3 civilizationGenome** → State topology, routing pattern, token inheritance

## DNA
- Hash: \`${dg.dnaHash}\`
- Sector: ${dg.sectorContext.primary} / ${dg.sectorContext.subSector}
- Fonts: ${c.ch3_type_display?.displayName} (display) · ${c.ch4_type_body?.displayName} (body)
`;
    }
}
export const designBriefGenerator = new DesignBriefGenerator();
