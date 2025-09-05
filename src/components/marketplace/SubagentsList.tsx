import { useState, useEffect } from 'react';
import { Bot, Brain, Cpu, Zap, Check, Copy, ExternalLink, Shield, Database, Globe } from 'lucide-react';
import { featuredPackages, discoverHugsyPackages, DiscoveredPackage } from '../../services/packageDiscovery';
import { getPackageInfo } from '../../services/npmRegistry';

const subagentIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '@hugsylabs/subagent-coder': Brain,
  '@hugsylabs/subagent-researcher': Globe,
  '@hugsylabs/subagent-tester': Shield,
  '@hugsylabs/subagent-analyst': Database,
  '@hugsylabs/subagent-reviewer': Cpu,
};

interface SubagentsListProps {
  onSelectPackage?: (packageName: string) => void;
}

export default function SubagentsList({ onSelectPackage }: SubagentsListProps) {
  const [subagents, setSubagents] = useState<DiscoveredPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedPackage, setCopiedPackage] = useState<string | null>(null);
  const [selectedSubagent, setSelectedSubagent] = useState<string | null>(null);
  const [subagentDetails, setSubagentDetails] = useState<any>(null);

  useEffect(() => {
    loadSubagents();
  }, []);

  const loadSubagents = async () => {
    setLoading(true);
    try {
      // Search for subagent packages  
      const response = await fetch('https://registry.npmjs.org/-/v1/search?text=subagent%20OR%20sub-agent&size=50');
      const data = await response.json();
      
      const foundSubagents: DiscoveredPackage[] = [];
      
      for (const obj of data.objects || []) {
        const pkg = obj.package;
        // Filter for packages that are actually subagents
        if (pkg.name.includes('subagent') || pkg.name.includes('sub-agent')) {
          foundSubagents.push({
            name: pkg.name,
            description: pkg.description || 'AI-powered autonomous agent for specialized tasks',
            version: pkg.version,
            type: 'subagent' as any
          });
        }
      }
      
      // If we have too many results, limit to first 8
      if (foundSubagents.length > 8) {
        foundSubagents.splice(8);
      }
      
      setSubagents(foundSubagents);
    } catch (error) {
      console.error('Error loading subagents:', error);
    }
    setLoading(false);
  };

  const copyToClipboard = (packageName: string) => {
    const configLine = `"subagents": ["${packageName}"]`;
    navigator.clipboard.writeText(configLine);
    setCopiedPackage(packageName);
    setTimeout(() => setCopiedPackage(null), 2000);
  };

  const viewDetails = async (packageName: string) => {
    if (onSelectPackage) {
      onSelectPackage(packageName);
    } else {
      setSelectedSubagent(packageName);
      const info = await getPackageInfo(packageName);
      setSubagentDetails(info);
    }
  };

  if (selectedSubagent && subagentDetails) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setSelectedSubagent(null);
            setSubagentDetails(null);
          }}
          className="mb-6 text-primary-600 hover:text-primary-700 flex items-center space-x-2"
        >
          <span>← Back to subagents</span>
        </button>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {subagentDetails.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {subagentDetails.description}
              </p>
            </div>
            <span className="text-sm text-gray-500 font-mono">v{subagentDetails.version}</span>
          </div>

          <div className="flex space-x-3 mb-6">
            <button
              onClick={() => copyToClipboard(subagentDetails.name)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {copiedPackage === subagentDetails.name ? (
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
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Usage</h3>
            <pre className="text-sm overflow-x-auto">
              <code>{`// .hugsyrc
{
  "subagents": [
    "${subagentDetails.name}"
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading && (
        <div className="col-span-full flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {!loading && subagents.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No subagents found. Check back later!
          </p>
        </div>
      )}

      {!loading && subagents.map((subagent) => {
        const Icon = subagentIcons[subagent.name] || Bot;
        
        return (
          <div
            key={subagent.name}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                AI
              </span>
            </div>

            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
              {subagent.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
              {subagent.description}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(subagent.name)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => viewDetails(subagent.name)}
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
  );
}