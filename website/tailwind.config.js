/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // These will be overridden by genome.json at runtime
        background: '#0a0a0a',
        surface: '#141414',
        'surface-elevated': '#1a1a1a',
        primary: 'hsl(var(--primary-hue, 145), var(--primary-sat, 27%), var(--primary-light, 53%))',
        'primary-dim': 'hsl(var(--primary-hue, 145), var(--primary-sat, 27%), var(--primary-light, 53%), 0.1)',
      },
      fontFamily: {
        display: ['var(--font-display, "Fraunces"), "Playfair Display", serif'],
        body: ['var(--font-body, "Merriweather"), Georgia, serif'],
        mono: ['Space Grotesk', 'system-ui', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'genome': 'var(--edge-radius, 27px)',
      },
      transitionTimingFunction: {
        'genome': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
