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
        <section id="docs" className="w-full py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 bg-surface">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 md:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase mb-4 sm:mb-6">Installation & Protocol</h2>
                    <p className="text-base sm:text-lg md:text-xl opacity-80 font-body max-w-3xl mx-auto leading-relaxed border-b-2 border-black pb-8 sm:pb-10">
                        The probability of finding life-bearing planetary bodies is infinitesimally small. Finding a UI design perfectly suited to your context is equally difficult. Permutations MCP acts as a continuous evolutionary engine that runs <b>locally</b> in your IDE.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                    {/* Left Col: Setup */}
                    <div 
                        className="inline-block border-2 border-black bg-white text-left w-full h-fit overflow-hidden"
                        style={{ boxShadow: '8px 8px 0px #7f93c9' }}
                    >
                        <div className="bg-gray-100 border-b-2 border-black p-4 flex justify-between items-center">
                            <code className="font-mono text-xs text-black uppercase tracking-widest font-bold flex items-center gap-2">
                                <Terminal size={14} /> IDE mcp.json Configuration
                            </code>
                        </div>
                        <div className="p-5 sm:p-6 relative">
                            <code className="font-mono text-sm sm:text-base font-bold text-wrap break-words block mb-4 sm:mb-6 pr-16">{command}</code>

                            <button
                                onClick={handleCopy}
                                className="absolute top-5 sm:top-6 right-5 sm:right-6 p-2 bg-gray-100 border border-gray-300 hover:bg-black hover:text-white transition-colors flex items-center gap-2 text-xs font-mono uppercase"
                                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                            >
                                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                            </button>

                            <div className="border-t border-gray-200 pt-5 sm:pt-6 flex flex-col gap-2 sm:gap-3">
                                <div className="text-xs font-mono uppercase font-bold text-gray-500 mb-1">Required: At least ONE API key:</div>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>GROQ_API_KEY</span>
                                    <span className="text-primary">llama-3.3-70b</span>
                                </span>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>OPENAI_API_KEY</span>
                                    <span className="text-primary">gpt-4o / gpt-4o-mini</span>
                                </span>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>ANTHROPIC_API_KEY</span>
                                    <span className="text-primary">claude-3-5-sonnet</span>
                                </span>
                                <span className="font-mono text-xs bg-gray-100 border border-gray-300 px-3 py-2 font-bold flex justify-between">
                                    <span>GEMINI_API_KEY</span>
                                    <span className="text-primary">gemini-1.5-flash</span>
                                </span>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">* Semantic extraction uses your key. DNA generation is 100% local.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Lore / Rigorous explanation */}
                    <div className="p-6 sm:p-8 border-2 border-black bg-black text-white flex flex-col justify-center">
                        <h3 className="font-display font-bold uppercase text-xl sm:text-2xl text-primary mb-4">Why Bring Your Own Key?</h3>
                        <p className="font-body text-sm leading-relaxed mb-6 opacity-90">
                            We do not control the engine; the math does. Permutations bypasses centralized cloud databases. By using your own LLM key for the <b>Semantic Extraction Phase</b>, we ensure absolute privacy. The DNA generation step remains 100% local, derived from the hash of your project.
                        </p>
                        <h4 className="font-mono text-xs uppercase text-gray-400 mb-3">Supported Lifeforms (LLMs)</h4>
                        <ul className="font-mono text-xs space-y-2 opacity-80 border-l px-4 border-gray-700">
                            <li>- <strong className="text-primary">Groq</strong> (llama-3.3-70b-versatile) - Fastest, cheapest</li>
                            <li>- <strong className="text-primary">OpenAI</strong> (gpt-4o / gpt-4o-mini) - Most reliable JSON</li>
                            <li>- <strong className="text-primary">Anthropic</strong> (claude-3-5-sonnet) - Best reasoning</li>
                            <li>- <strong className="text-primary">Google</strong> (gemini-1.5-flash) - Lowest latency</li>
                        </ul>
                        <div className="mt-6 p-4 bg-gray-900 border-l-4 border-primary">
                            <p className="text-xs font-mono text-gray-400">
                                <strong className="text-white">Auto-detection:</strong> Set any supported key as env var. The engine automatically routes to the available provider.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
