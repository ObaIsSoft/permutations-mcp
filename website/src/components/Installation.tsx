import { useState } from 'react';
import { Terminal, Copy, Check, Zap } from 'lucide-react';

const API_KEYS = [
    { name: 'GROQ_API_KEY', model: 'llama-3.3-70b-versatile', tag: '⚡ FASTEST' },
    { name: 'OPENAI_API_KEY', model: 'gpt-4o / gpt-4o-mini', tag: 'Most Reliable' },
    { name: 'ANTHROPIC_API_KEY', model: 'claude-3-5-sonnet', tag: 'Best Reasoning' },
    { name: 'GEMINI_API_KEY', model: 'gemini-1.5-flash', tag: 'Low Latency' },
];

const MCP_CONFIG = `{
  "mcpServers": {
    "permutations": {
      "command": "node",
      "args": [
        "/path/to/permutations/dist/server.js"
      ],
      "env": {
        "GROQ_API_KEY": "your_key"
      }
    }
  }
}`;

export function Installation() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(MCP_CONFIG);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="docs" className="w-full py-24 md:py-36 px-6 md:px-12"
            style={{ background: 'var(--color-bg)' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-16" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '32px' }}>
                    <div className="section-line" />
                    <p className="dna-label mb-3">Protocol</p>
                    <h2 className="font-display font-bold uppercase text-white"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
                        Install &amp; Initialize
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* MCP Config block */}
                    <div style={{ borderRadius: 'var(--edge-radius)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'var(--color-surface)' }}>
                        {/* Terminal header */}
                        <div className="flex items-center justify-between px-5 py-3"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                                </div>
                                <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                    <Terminal size={10} className="inline mr-1.5" />
                                    mcp.json configuration
                                </span>
                            </div>
                            <button onClick={handleCopy}
                                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all"
                                style={{
                                    color: copied ? 'var(--color-primary)' : 'rgba(255,255,255,0.35)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 'var(--edge-radius)',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                }}>
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        {/* Code content */}
                        <pre className="p-5 text-xs leading-relaxed overflow-x-auto"
                            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-display), monospace' }}>
                            <code style={{ color: 'var(--color-primary)' }}>{MCP_CONFIG}</code>
                        </pre>
                        {/* Footer */}
                        <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            <Zap size={11} style={{ color: 'var(--color-primary)' }} />
                            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                DNA generation is 100% local. Only semantic extraction calls your LLM.
                            </span>
                        </div>
                    </div>

                    {/* Right: API keys + why BYOK */}
                    <div className="flex flex-col gap-6">
                        {/* API keys */}
                        <div>
                            <p className="dna-label mb-4">Supported Lifeforms (LLMs) — pick one</p>
                            <div className="flex flex-col gap-2">
                                {API_KEYS.map(({ name, model, tag }, i) => (
                                    <div key={name} className="flex items-center justify-between px-4 py-3"
                                        style={{
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: 'var(--edge-radius)',
                                            background: i === 0 ? 'var(--color-primary-dim)' : 'transparent',
                                            borderColor: i === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                                        }}>
                                        <div>
                                            <code className="font-mono text-xs text-white block">{name}</code>
                                            <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{model}</span>
                                        </div>
                                        <span className="font-mono text-[9px] px-2 py-1 uppercase tracking-wider"
                                            style={{
                                                color: i === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                                border: `1px solid ${i === 0 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '3px',
                                            }}>{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why BYOK */}
                        <div className="p-6" style={{
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 'var(--edge-radius)',
                            background: 'var(--color-surface)',
                        }}>
                            <h3 className="font-display font-bold uppercase text-white text-xs tracking-widest mb-3">
                                Why Bring Your Own Key?
                            </h3>
                            <p className="font-mono text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                We do not control the engine — the math does. Your LLM key is used only
                                for Semantic Extraction (5 trait vectors). The chromosome sequencing and
                                all 5 generators run locally. No API call touches your actual design data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
