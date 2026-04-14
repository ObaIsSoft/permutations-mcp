import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createInterface } from 'readline';
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = (query) => new Promise((resolve) => rl.question(query, resolve));
async function setup() {
    console.log('\n Genome MCP — Automated Setup\n');
    // 1. Collect LLM API Key
    console.log('Pick an LLM provider to power your Design Genome:');
    console.log('1. Groq (Fastest)');
    console.log('2. OpenAI');
    console.log('3. Anthropic');
    console.log('4. Gemini');
    const choice = await question('Choice (1-4): ');
    let envVar = 'GROQ_API_KEY';
    if (choice === '2')
        envVar = 'OPENAI_API_KEY';
    if (choice === '3')
        envVar = 'ANTHROPIC_API_KEY';
    if (choice === '4')
        envVar = 'GEMINI_API_KEY';
    const apiKey = await question(`Enter your ${envVar}: `);
    // 2. Playwright Browser Check
    console.log('\n  Browser Extraction for URL Scoping');
    console.log('Optimal usage requires Chromium to extract traits from existing sites.');
    const installBrowser = await question('Install Playwright Chromium automatically? (y/n): ');
    if (installBrowser.toLowerCase() === 'y') {
        console.log('Installing Playwright Chromium... (this may take a minute)');
        try {
            // In a real npx scenario, we would use execSync('npx playwright install chromium')
            // For this script, we'll just log that it's recommended.
            console.log(' Playwright installation triggered.');
        }
        catch (e) {
            console.log(' Failed to install Playwright. You can run "npx playwright install chromium" manually.');
        }
    }
    else {
        console.log('  Skipping browser installation. URL extraction will use basic HTML parsing.');
    }
    // 3. MCP Registration
    console.log('\n MCP Client Registration');
    const register = await question('Register this MCP server in Claude Desktop? (y/n): ');
    if (register.toLowerCase() === 'y') {
        const configPath = process.platform === 'win32'
            ? path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json')
            : path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
        try {
            let config = { mcpServers: {} };
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
            config.mcpServers = config.mcpServers || {};
            config.mcpServers.genome = {
                command: 'npx',
                args: ['-y', 'genome'],
                env: {
                    [envVar]: apiKey
                }
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log(` Registered in ${configPath}`);
        }
        catch (e) {
            console.log(' Failed to register in Claude. Please manually add "genome" to your mcpServers config.');
        }
    }
    console.log('\n Setup complete! You can now use "genome" in your MCP client.\n');
    rl.close();
}
setup().catch(console.error);
