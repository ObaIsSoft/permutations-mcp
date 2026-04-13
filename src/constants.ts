// Centralized constants for domain thresholds, counts, and configuration values
// Update these as needed for tuning or maintainability

export const CIVILIZATION_COMPLEXITY_THRESHOLDS = {
  tribal: 0.81,
  cityState: 0.87,
  nationState: 0.92,
  empire: 0.95,
  network: 0.97,
  singularity: 0.99,
};

export const CIVILIZATION_COMPONENT_COUNTS = {
  tribal: [8, 14],
  cityState: [14, 22],
  nationState: [22, 35],
  empire: [35, 52],
  network: [52, 72],
  singularity: [100, 160],
};

export const CIVILIZATION_MODULES = {
  tribal: 3,
  cityState: 5,
  nationState: 8,
  empire: 12,
  network: 18,
};

export const TRANSITION_DURATIONS = {
  opacityFade: 300,
  viewTransitionApi: 400,
  clipWipeRight: 600,
  clipCurtainUp: 700,
  clipCircleExpand: 600,
  css3dFlip: 800,
  colorWash: 900,
  morphBlob: 700,
  gridReveal: 1000,
  glitchShatter: 600,
  textScramble: 800,
  noiseDissolve: 1000,
};

export const ENTROPY_THRESHOLDS = {
  low: 0.25,
  mid: 0.50,
  high: 0.70,
};

// Add more as needed for other catalogs/configs
