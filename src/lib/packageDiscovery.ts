import { searchPackages } from './npmRegistry';

export interface DiscoveredPackage {
  name: string;
  description: string;
  version: string;
  type: 'preset' | 'plugin' | 'command';
}

export async function discoverHugsyPackages(): Promise<{
  presets: DiscoveredPackage[];
  plugins: DiscoveredPackage[];
  commands: DiscoveredPackage[];
}> {
  const [presets, plugins, commands] = await Promise.all([
    searchPackages('@hugsylabs preset'),
    searchPackages('@hugsylabs plugin'),
    searchPackages('@hugsylabs command'),
  ]);

  // Also search for community packages
  const [communityPresets, communityPlugins, communityCommands] = await Promise.all([
    searchPackages('hugsy preset'),
    searchPackages('hugsy plugin'),
    searchPackages('hugsy command'),
  ]);

  return {
    presets: [...presets, ...communityPresets]
      .filter(pkg => pkg.name.includes('preset'))
      .map(pkg => ({ ...pkg, type: 'preset' as const })),
    plugins: [...plugins, ...communityPlugins]
      .filter(pkg => pkg.name.includes('plugin'))
      .map(pkg => ({ ...pkg, type: 'plugin' as const })),
    commands: [...commands, ...communityCommands]
      .filter(pkg => pkg.name.includes('command'))
      .map(pkg => ({ ...pkg, type: 'command' as const })),
  };
}

// Static list for common/featured packages
export const featuredPackages = {
  presets: [
    {
      name: '@hugsylabs/preset-recommended',
      description: 'Recommended preset with balanced security and developer experience',
      version: '1.0.0',
      type: 'preset' as const,
    },
    {
      name: '@hugsylabs/preset-strict',
      description: 'Strict security preset with minimal permissions',
      version: '1.0.0',
      type: 'preset' as const,
    },
    {
      name: '@hugsylabs/preset-development',
      description: 'Development preset with flexible permissions for rapid iteration',
      version: '1.0.0',
      type: 'preset' as const,
    },
  ],
  plugins: [
    {
      name: '@hugsylabs/plugin-git',
      description: 'Git integration plugin for version control operations',
      version: '1.0.0',
      type: 'plugin' as const,
    },
    {
      name: '@hugsylabs/plugin-node',
      description: 'Node.js development plugin with npm/yarn/pnpm support',
      version: '1.0.0',
      type: 'plugin' as const,
    },
    {
      name: '@hugsylabs/plugin-typescript',
      description: 'TypeScript support with type checking and compilation',
      version: '1.0.0',
      type: 'plugin' as const,
    },
    {
      name: '@hugsylabs/plugin-python',
      description: 'Python development support with pip and virtual environments',
      version: '1.0.0',
      type: 'plugin' as const,
    },
  ],
  commands: [
    {
      name: '@hugsylabs/commands-git',
      description: 'Git workflow commands for commits, branches, and PRs',
      version: '1.0.0',
      type: 'command' as const,
    },
    {
      name: '@hugsylabs/commands-test',
      description: 'Testing commands for various frameworks',
      version: '1.0.0',
      type: 'command' as const,
    },
    {
      name: '@hugsylabs/commands-build',
      description: 'Build and deployment commands',
      version: '1.0.0',
      type: 'command' as const,
    },
  ],
};