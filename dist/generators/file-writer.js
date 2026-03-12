/**
 * Permutations MCP - Design File Writer
 *
 * Writes generated design outputs to disk as organized file structures.
 * Creates ready-to-use component files, styles, and configuration.
 */
import * as fs from "fs/promises";
import * as path from "path";
/**
 * Organizes generated design outputs into a structured file system
 */
export class DesignFileWriter {
    /**
     * Write complete design system to disk
     */
    async writeDesignSystem(genome, outputs, options) {
        const result = {
            success: true,
            files: [],
            errors: [],
            baseDir: options.baseDir
        };
        try {
            // Ensure base directory exists
            await fs.mkdir(options.baseDir, { recursive: true });
            // Write each output type to appropriate location
            const writes = [];
            // Handle both direct CSS and civilization tokens
            const cssContent = outputs.css || outputs.tokens;
            if (cssContent) {
                writes.push(this.writeFile(path.join(options.baseDir, "styles", `genome.${options.styling === "scss" ? "scss" : "css"}`), cssContent, result));
            }
            if (outputs.components) {
                const ext = options.typescript ? "tsx" : "jsx";
                writes.push(this.writeFile(path.join(options.baseDir, "components", `DesignSystem.${ext}`), outputs.components, result));
            }
            if (outputs.animations) {
                writes.push(this.writeFile(path.join(options.baseDir, "lib", "animations.ts"), outputs.animations, result));
            }
            if (outputs.architecture) {
                writes.push(this.writeFile(path.join(options.baseDir, "lib", "architecture.ts"), outputs.architecture, result));
            }
            if (outputs.interactions) {
                writes.push(this.writeFile(path.join(options.baseDir, "lib", "interactions.ts"), outputs.interactions, result));
            }
            if (outputs.index) {
                writes.push(this.writeFile(path.join(options.baseDir, "index.ts"), outputs.index, result));
            }
            if (outputs.html) {
                writes.push(this.writeFile(path.join(options.baseDir, "preview", "index.html"), outputs.html, result));
            }
            if (outputs.webgl) {
                writes.push(this.writeFile(path.join(options.baseDir, "components", "Procedural3D.tsx"), outputs.webgl, result));
            }
            if (outputs.fx) {
                writes.push(this.writeFile(path.join(options.baseDir, "styles", "atmosphere.css"), outputs.fx, result));
            }
            if (outputs.svg) {
                writes.push(this.writeFile(path.join(options.baseDir, "assets", "biomarker.svg"), outputs.svg, result));
            }
            // Write genome metadata
            writes.push(this.writeFile(path.join(options.baseDir, "genome.json"), JSON.stringify(genome, null, 2), result));
            await Promise.all(writes);
        }
        catch (error) {
            result.success = false;
            result.errors.push(`Failed to write design system: ${error}`);
        }
        return result;
    }
    /**
     * Write individual component files from component specs
     */
    async writeComponentFiles(components, genome, baseDir, options = {}) {
        const result = {
            success: true,
            files: [],
            errors: [],
            baseDir
        };
        const ext = options.typescript ? "tsx" : "jsx";
        const framework = options.framework || "react";
        try {
            const componentsDir = path.join(baseDir, "components");
            await fs.mkdir(componentsDir, { recursive: true });
            for (const spec of components) {
                const content = this.generateComponentFile(spec, genome, framework, options.typescript);
                const filePath = path.join(componentsDir, `${spec.name}.${ext}`);
                await this.writeFile(filePath, content, result);
            }
            // Write barrel export
            const exports = components.map(c => `export { ${c.name} } from './${c.name}';`).join("\n");
            await this.writeFile(path.join(componentsDir, `index.${ext}`), exports, result);
        }
        catch (error) {
            result.success = false;
            result.errors.push(`Failed to write components: ${error}`);
        }
        return result;
    }
    /**
     * Generate a standalone HTML preview file
     */
    generatePreviewHTML(genome, css, html) {
        const primary = genome.chromosomes.ch5_color_primary;
        const displayFont = genome.chromosomes.ch3_type_display;
        const bodyFont = genome.chromosomes.ch4_type_body;
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permutations Preview - ${genome.dnaHash.slice(0, 8)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${displayFont.importUrl}" rel="stylesheet">
    <link href="${bodyFont.importUrl}" rel="stylesheet">
    <style>
        ${css}
        
        /* Preview-specific styles */
        .preview-container {
            min-height: 100vh;
            background: ${genome.chromosomes.ch6_color_temp.surfaceStack[0]};
        }
        
        .preview-info {
            position: fixed;
            bottom: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
            right: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
            background: ${genome.chromosomes.ch6_color_temp.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.8)'};
            color: ${genome.chromosomes.ch6_color_temp.isDark ? genome.chromosomes.ch6_color_temp.surfaceStack[0] : genome.chromosomes.ch6_color_temp.surfaceStack[genome.chromosomes.ch6_color_temp.surfaceStack.length - 1]};
            padding: ${genome.chromosomes.ch2_rhythm.baseSpacing}px;
            border-radius: ${genome.chromosomes.ch7_edge.componentRadius}px;
            font-family: monospace;
            font-size: ${Math.max(11, genome.chromosomes.ch16_typography.baseSize * 0.75)}px;
            max-width: ${280 + Math.floor((parseInt(genome.dnaHash.slice(0, 2), 16) / 255) * 80)}px;
            z-index: 9999;
        }
        
        .preview-info h3 {
            margin: 0 0 ${genome.chromosomes.ch2_rhythm.baseSpacing / 2}px 0;
            font-size: ${Math.max(12, genome.chromosomes.ch16_typography.baseSize * 0.875)}px;
        }
        
        .preview-info code {
            background: ${genome.chromosomes.ch6_color_temp.isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'};
            padding: ${Math.max(2, genome.chromosomes.ch2_rhythm.baseSpacing / 8)}px ${Math.max(4, genome.chromosomes.ch2_rhythm.baseSpacing / 4)}px;
            border-radius: ${Math.max(2, genome.chromosomes.ch7_edge.radius / 4)}px;
        }
        
        .chromosome-tag {
            display: inline-block;
            background: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%);
            color: ${genome.chromosomes.ch6_color_temp.surfaceStack[genome.chromosomes.ch6_color_temp.isDark ? 1 : 0]};
            padding: ${genome.chromosomes.ch2_rhythm.baseSpacing / 4}px ${genome.chromosomes.ch2_rhythm.baseSpacing / 2}px;
            border-radius: ${Math.max(2, genome.chromosomes.ch7_edge.radius / 2)}px;
            margin: ${genome.chromosomes.ch2_rhythm.baseSpacing / 8}px;
            font-size: ${Math.max(10, genome.chromosomes.ch16_typography.baseSize * 0.75)}px;
        }
    </style>
</head>
<body>
    <div class="preview-container">
        ${html}
    </div>
    
    <div class="preview-info">
        <h3>🧬 Permutations Preview</h3>
        <div>Hash: <code>${genome.dnaHash.slice(0, 16)}...</code></div>
        <div>Sector: <span class="chromosome-tag">${genome.sectorContext.primary}</span></div>
        <div>Hero: <span class="chromosome-tag">${genome.chromosomes.ch19_hero_type.type}</span></div>
        <div>Motion: <span class="chromosome-tag">${genome.chromosomes.ch8_motion.physics}</span></div>
        <div>Primary: <span class="chromosome-tag">hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)</span></div>
        <br>
        <div><strong>25 Chromosomes Active</strong></div>
        <div style="margin-top: ${genome.chromosomes.ch2_rhythm.baseSpacing / 2}px; opacity: 0.7;">
            Generated ${new Date().toLocaleDateString()}
        </div>
    </div>
</body>
</html>`;
    }
    /**
     * Generate file structure report for agent consumption
     */
    generateFileStructure(files, baseDir) {
        const tree = {};
        for (const file of files) {
            const relative = path.relative(baseDir, file);
            const dir = path.dirname(relative);
            if (!tree[dir])
                tree[dir] = [];
            tree[dir].push(path.basename(relative));
        }
        let output = "Generated Design System Structure\n";
        output += "=====================================\n\n";
        for (const [dir, files] of Object.entries(tree).sort()) {
            const displayDir = dir === "." ? "root" : dir;
            output += `${displayDir}/\n`;
            for (const file of files.sort()) {
                output += `  ├── ${file}\n`;
            }
            output += "\n";
        }
        return output;
    }
    async writeFile(filePath, content, result) {
        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, content, "utf-8");
            result.files.push(filePath);
        }
        catch (error) {
            result.errors.push(`Failed to write ${filePath}: ${error}`);
        }
    }
    generateComponentFile(spec, genome, framework, typescript) {
        if (framework === "react") {
            return this.generateReactComponent(spec, genome, typescript);
        }
        if (framework === "vue") {
            return this.generateVueComponent(spec, genome, typescript);
        }
        if (framework === "svelte") {
            return this.generateSvelteComponent(spec, genome);
        }
        return "";
    }
    generateReactComponent(spec, genome, typescript) {
        const edgeRadius = genome.chromosomes.ch7_edge.radius;
        const primary = genome.chromosomes.ch5_color_primary;
        const motion = genome.chromosomes.ch8_motion.physics;
        const propsInterface = typescript
            ? `interface ${spec.name}Props {
${spec.props.map(p => `  ${p.name}${p.required ? "" : "?"}: ${p.type};`).join("\n")}
}`
            : "";
        const propsDestructuring = spec.props.map(p => p.name).join(", ");
        const motionProps = motion !== "none"
            ? `transition={{ duration: ${genome.chromosomes.ch8_motion.durationScale}, ease: "${motion}" }}`
            : "";
        return `import React from 'react';${motion !== "none" ? "\nimport { motion } from 'framer-motion';" : ""}
${typescript ? "\n" + propsInterface : ""}

export function ${spec.name}({ ${propsDestructuring} }${typescript ? `: ${spec.name}Props` : ""}) {
  return (
    ${motion !== "none" ? "<motion.div" : "<div"}
      role="${spec.accessibility.role}"
      style={{
        borderRadius: '${edgeRadius}px',
        // Primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%)
      }}
      ${motionProps}
    >
      {/* ${spec.name} component - implement based on design requirements */}
    ${motion !== "none" ? "</motion.div>" : "</div>"}
  );
}
`;
    }
    generateVueComponent(spec, genome, typescript) {
        const edgeRadius = genome.chromosomes.ch7_edge.radius;
        const primary = genome.chromosomes.ch5_color_primary;
        const propsDef = spec.props.map(p => {
            const defaultVal = p.default !== undefined ? JSON.stringify(p.default) : "undefined";
            return `    ${p.name}: ${typescript ? `${p.type} ` : ""}${p.required ? "required: true" : `default: ${defaultVal}`}`;
        }).join(",\n");
        return `<template>
  <div
    role="${spec.accessibility.role}"
    :style="{ borderRadius: '${edgeRadius}px' }"
  >
    <!-- ${spec.name} component - implement based on design requirements -->
    <slot />
  </div>
</template>

<script${typescript ? ' lang="ts"' : ""}>
export default {
  name: '${spec.name}',
  props: {
${propsDef}
  }
}
</script>

<style scoped>
/* Primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) */
</style>
`;
    }
    generateSvelteComponent(spec, genome) {
        const edgeRadius = genome.chromosomes.ch7_edge.radius;
        const primary = genome.chromosomes.ch5_color_primary;
        const propsExport = spec.props.map(p => {
            const defaultVal = p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : "";
            return `  export let ${p.name}${defaultVal};`;
        }).join("\n");
        return `<script>
${propsExport}
</script>

<div
  role="${spec.accessibility.role}"
  style="border-radius: ${edgeRadius}px;"
>
  <!-- ${spec.name} component - implement based on design requirements -->
  <slot />
</div>

<style>
  /* Primary: hsl(${primary.hue}, ${Math.round(primary.saturation * 100)}%, ${Math.round(primary.lightness * 100)}%) */
</style>
`;
    }
}
// Singleton instance
export const designFileWriter = new DesignFileWriter();
