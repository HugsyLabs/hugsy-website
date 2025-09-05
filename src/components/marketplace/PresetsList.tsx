import { useState, useEffect } from 'react';
import { Package, Check, Star, Shield, Code, Zap, Copy, ExternalLink } from 'lucide-react';
import { featuredPackages, discoverHugsyPackages, DiscoveredPackage } from '../../services/packageDiscovery';
import { getPackageInfo } from '../../services/npmRegistry';

const presetIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '@hugsylabs/preset-recommended': Star,
  '@hugsylabs/preset-strict': Shield,
  '@hugsylabs/preset-development': Code,
  '@hugsylabs/preset-showcase': Zap,
};

interface PresetsListProps {
  onSelectPackage?: (packageName: string) => void;
}

export default function PresetsList({ onSelectPackage }: PresetsListProps) {
  const [presets, setPresets] = useState<DiscoveredPackage[]>(featuredPackages.presets);
  const [loading, setLoading] = useState(false);
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [presetDetails, setPresetDetails] = useState<any>(null);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    setLoading(true);
    try {
      const discovered = await discoverHugsyPackages();
      const allPresets = [...featuredPackages.presets, ...discovered.presets];
      
      // Remove duplicates
      const uniquePresets = Array.from(
        new Map(allPresets.map(p => [p.name, p])).values()
      );
      
      setPresets(uniquePresets);
    } catch (error) {
      console.error('Error loading presets:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (packageName: string) => {
    const configLine = `"extends": "${packageName}"`;
    navigator.clipboard.writeText(configLine);
    setCopiedPackage(packageName);
    setTimeout(() => setCopiedPackage(null), 2000);
  };

  const viewDetails = async (packageName: string) => {
    if (onSelectPackage) {
      onSelectPackage(packageName);
    } else {
      setSelectedPreset(packageName);
      const info = await getPackageInfo(packageName);
      setPresetDetails(info);
    }
  };

  if (selectedPreset && presetDetails) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setSelectedPreset(null);
            setPresetDetails(null);
          }}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center space-x-2"
        >
          <span>← Back to presets</span>
        </button>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {presetDetails.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {presetDetails.description}
              </p>
            </div>
            <span className="text-sm text-gray-500 font-mono">v{presetDetails.version}</span>
          </div>

          <div className="flex space-x-3 mb-6">
            <button
              onClick={() => copyToClipboard(presetDetails.name)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {copiedPackage === presetDetails.name ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Config</span>
                </>
              )}
            </button>
            
            {presetDetails.homepage && (
              <a
                href={presetDetails.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on NPM</span>
              </a>
            )}
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Usage</h3>
            <pre className="text-sm overflow-x-auto">
              <code>{`// .hugsyrc
{
  "extends": "${presetDetails.name}"
}`}</code>
            </pre>
          </div>

          {presetDetails.readme && (
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="font-semibold mb-2">Documentation</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{presetDetails.readme}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading presets...</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {presets.map((preset) => {
          const Icon = presetIcons[preset.name] || Package;
          const isOfficial = preset.name.startsWith('@hugsylabs/');
          
          return (
            <div
              key={preset.name}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                {isOfficial && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                    Official
                  </span>
                )}
              </div>

              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                {preset.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
                {preset.description}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(preset.name)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => viewDetails(preset.name)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 rounded text-xs transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && presets.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No presets found</p>
        </div>
      )}
    </div>
  );
}