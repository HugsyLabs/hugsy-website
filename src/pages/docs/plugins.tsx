import Head from 'next/head'
import DocsLayout from '@/components/DocsLayout'
import CodeBlock from '@/components/CodeBlock'

export default function Plugins() {
  const examplePlugin = `/**
 * Example Hugsy Plugin
 * Adds custom permissions and hooks to your configuration
 */
const myPlugin = {
  name: 'my-custom-plugin',
  description: 'Adds custom development tools support',
  
  transform(config) {
    // Add custom permissions
    config.permissions = config.permissions || {};
    config.permissions.allow = config.permissions.allow || [];
    config.permissions.allow.push(
      'Bash(docker *)',
      'Bash(kubectl *)',
      'Write(**/*.test.js)'
    );
    
    // Add environment variables
    config.env = config.env || {};
    config.env.PLUGIN_ENABLED = 'true';
    config.env.ENVIRONMENT = 'development';
    
    // Add hooks for monitoring
    config.hooks = config.hooks || {};
    config.hooks['PreToolUse'] = config.hooks['PreToolUse'] || [];
    config.hooks['PreToolUse'].push({
      matcher: 'Write(**)',
      command: 'echo "File modification detected"'
    });
    
    return config;
  }
};

export default myPlugin;`;

  const usageExample = `{
  "extends": "@hugsylabs/hugsy-compiler/presets/development",
  "plugins": [
    "./plugins/my-custom-plugin.js",
    "./plugins/auto-format.js"
  ]
}`;

  return (
    <>
      <Head>
        <title>Plugins - Hugsy Documentation</title>
      </Head>
      <DocsLayout title="Plugins">
        <div className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Plugins allow you to extend and modify Hugsy configurations dynamically. They can add permissions, 
            environment variables, hooks, and more to your Claude Code setup.
          </p>

          <h2 className="text-2xl font-bold">Using Plugins</h2>
          <p>
            Plugins are specified in your <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.hugsyrc.json</code> file.
            You can use local plugins or published npm packages:
          </p>

          <CodeBlock language="json" code={usageExample} />

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Plugin Loading Order</h3>
            <p className="text-sm">
              Plugins are loaded and applied in the order they appear in the configuration. 
              Each plugin receives the config transformed by previous plugins.
            </p>
          </div>

          <h2 className="text-2xl font-bold">Creating a Plugin</h2>
          <p>
            A Hugsy plugin is a JavaScript module that exports an object with a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">transform</code> function:
          </p>

          <CodeBlock language="javascript" code={examplePlugin} />

          <h3 className="text-xl font-bold">Plugin Structure</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>name</strong>: Unique identifier for your plugin</li>
            <li><strong>description</strong>: Brief explanation of what the plugin does</li>
            <li><strong>transform(config)</strong>: Function that modifies and returns the configuration</li>
          </ul>

          <h2 className="text-2xl font-bold">What Plugins Can Do</h2>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Add Permissions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Control which operations Claude Code can perform:
              </p>
              <CodeBlock 
                language="javascript" 
                code={`config.permissions.allow.push('Bash(npm run *)');
config.permissions.deny.push('Write(**/production/**)');`} 
              />
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Set Environment Variables</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Add environment variables to Claude Code sessions:
              </p>
              <CodeBlock 
                language="javascript" 
                code={`config.env.NODE_ENV = 'development';
config.env.API_URL = 'https://api.example.com';`} 
              />
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Configure Hooks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Add hooks to monitor and react to Claude Code actions:
              </p>
              <CodeBlock 
                language="javascript" 
                code={`config.hooks['PreToolUse'].push({
  matcher: 'Bash(git commit *)',
  command: 'npm run pre-commit'
});`} 
              />
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Add Slash Commands</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Include slash command presets or custom commands:
              </p>
              <CodeBlock 
                language="javascript" 
                code={`config.commands = config.commands || {};
config.commands.presets = ['@hugsylabs/hugsy-compiler/presets/slash-commands-common'];`} 
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold">Publishing Plugins</h2>
          <p>
            To share your plugin with the community, publish it as an npm package:
          </p>
          
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a package with your plugin code</li>
            <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">hugsy-plugin</code> keyword to package.json</li>
            <li>Export your plugin as the default export</li>
            <li>Publish to npm with a scope (e.g., @yourname/hugsy-plugin-name)</li>
          </ol>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Always check if config properties exist before modifying them</li>
              <li>Use descriptive names for your plugins</li>
              <li>Document what your plugin does and why</li>
              <li>Test your plugin with different configurations</li>
              <li>Consider making your plugin configurable through options</li>
            </ul>
          </div>
        </div>
      </DocsLayout>
    </>
  )
}