// Package discovery service to find Hugsy packages on NPM
import { getPackageInfo } from './npmRegistry';

export interface DiscoveredPackage {
  name: string;
  description: string;
  version: string;
  type: 'preset' | 'plugin' | 'command';
}

/**
 * Search for Hugsy-related packages on NPM
 */
export async function discoverHugsyPackages(): Promise<{
  presets: DiscoveredPackage[];
  plugins: DiscoveredPackage[];
  commands: DiscoveredPackage[];
}> {
  try {
    // Search for HugsyLabs packages
    const response = await fetch('https://registry.npmjs.org/-/v1/search?text=@hugsylabs&size=50');
    const data = await response.json();
    
    const presets: DiscoveredPackage[] = [];
    const plugins: DiscoveredPackage[] = [];
    const commands: DiscoveredPackage[] = [];
    
    for (const obj of data.objects || []) {
      const pkg = obj.package;
      const name = pkg.name;
      
      // Categorize by package name pattern
      if (name.includes('preset')) {
        presets.push({
          name: pkg.name,
          description: pkg.description || '',
          version: pkg.version,
          type: 'preset'
        });
      } else if (name.includes('plugin')) {
        plugins.push({
          name: pkg.name,
          description: pkg.description || '',
          version: pkg.version,
          type: 'plugin'
        });
      } else if (name.includes('commands')) {
        commands.push({
          name: pkg.name,
          description: pkg.description || '',
          version: pkg.version,
          type: 'command'
        });
      }
    }
    
    // Also check for known patterns that might not be under @hugsylabs
    const knownPresets = [
      '@hugsy/recommended',
      '@hugsy/strict', 
      '@hugsy/development',
      '@hugsy/showcase'
    ];
    
    // Try to fetch info for known presets (these might not exist yet)
    for (const presetName of knownPresets) {
      try {
        const info = await getPackageInfo(presetName);
        if (info && !presets.some(p => p.name === presetName)) {
          presets.push({
            name: presetName,
            description: info.description || '',
            version: info.version,
            type: 'preset'
          });
        }
      } catch {
        // Package doesn't exist, skip
      }
    }
    
    return { presets, plugins, commands };
  } catch (error) {
    console.error('Error discovering packages:', error);
    // Return default/fallback packages
    return {
      presets: [
        {
          name: '@hugsylabs/preset-recommended',
          description: 'Recommended settings for most projects',
          version: '0.0.6',
          type: 'preset'
        }
      ],
      plugins: [
        {
          name: '@hugsylabs/plugin-git',
          description: 'Git integration for Hugsy',
          version: '0.0.6',
          type: 'plugin'
        },
        {
          name: '@hugsylabs/plugin-node',
          description: 'Node.js development support',
          version: '0.1.0',
          type: 'plugin'
        },
        {
          name: '@hugsylabs/plugin-python',
          description: 'Python development support',
          version: '0.0.6',
          type: 'plugin'
        }
      ],
      commands: [
        {
          name: '@hugsylabs/commands-dev',
          description: 'Development slash commands',
          version: '0.0.5',
          type: 'command'
        }
      ]
    };
  }
}

/**
 * Empty featured packages (no fake data)
 */
export const featuredPackages = {
  presets: [] as DiscoveredPackage[],
  plugins: [] as DiscoveredPackage[],
  commands: [] as DiscoveredPackage[]
};

/**
 * Get installed plugins from the current config
 */
export function getInstalledPlugins(config: any): string[] {
  return config.plugins || [];
}