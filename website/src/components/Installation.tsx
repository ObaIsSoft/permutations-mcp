import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

export function Installation() {
    const [copied, setCopied] = useState(false);
    const command = "node /path/to/permutations/dist/server.js";

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="docs" className="w-full py-24 px-4 md:px-12 bg-surface">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold uppercase mb-6">Installation & Protocol</h2>
                    <p className="text-xl opacity-80 font-body max-w-3xl mx-auto leading-relaxed border-b-2 border-black pb-8">
                        The probability of finding life-bearing planetary bodies is infinitesimally small. Finding a UI design perfectly suited strictly to your context—your own definition of life—is equally difficult. Permutations MCP acts as a continuous evolutionary engine that runs <b>locally</b> in your IDE to solve this. <br /><br />To prevent external contamination and algorithmic collapse, you must provide your own atmospheric conditions (API Key).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Col: Setup */}
                    <div className="inline-block border-2 border-black bg-white shadow-[8px_8px_0px_#0a5c12] text-left w-full h-fit overflow-hidden">
                        <div className="bg-gray-100 border-b-2 border-black p-3 flex justify-between items-center">
                            <code className="font-mono text-xs text-black uppercase tracking-widest font-bold flex items-center gap-2">
                                <Terminal size={14} /> IDE mcp.json Configuration
                            </code>
                        </div>
                        <div className="p-6 relative">
                            <code className="font-mono text-sm md:text-base font-bold text-wrap break-words block mb-6">{command}</code>

                            <button
                                onClick={handleCopy}
                                className="absolute top-6 right-6 p-2 bg-gray-100 border border-gray-300 hover:bg-black hover:text-white transition-colors flex items-center gap-2 text-xs font-mono uppercase"
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                            </button>

                            <div className="border-t border-gray-200 pt-6 flex flex-col gap-3">
                                <div className="text-xs font-mono uppercase font-bold text-gray-500 mb-1">Required Environment Variables:</div>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>GROQ_API_KEY</span>
                                    <span className="text-gray-500">Optional</span>
                                </span>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>OPENAI_API_KEY</span>
                                    <span className="text-gray-500">Optional</span>
                                </span>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>ANTHROPIC_API_KEY</span>
                                    <span className="text-gray-500">Optional</span>
                                </span>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">* At least one valid API key must be provided.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Lore / Rigorous explanation */}
                    <div className="p-8 border-2 border-black bg-black text-white flex flex-col justify-center">
                        <h3 className="font-display font-bold uppercase text-2xl text-primary mb-4">Why Bring Your Own Key?</h3>
                        <p className="font-body text-sm leading-relaxed mb-6 opacity-90">
                            We do not control the engine; the math does. Permutations bypasses centralized cloud databases. By forcing you to use your own LLM key for the <b>Semantic Extraction Phase</b>, we ensure absolute privacy. The DNA generation step remains 100% local, derived from the hash of your project.
                        </p>
                        <h4 className="font-mono text-xs uppercase text-gray-400 mb-2">Supported Lifeforms (LLMs)</h4>
                        <ul className="font-mono text-xs space-y-2 opacity-80 border-l px-4 border-gray-700">
                            <li>- <strong>Groq</strong> (llama-3.3-70b) - Recommended</li>
                            <li>- <strong>OpenAI</strong> (gpt-4o / gpt-4o-mini) - Supported</li>
                            <li>- <strong>Anthropic</strong> (claude-3-5) - Supported</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
