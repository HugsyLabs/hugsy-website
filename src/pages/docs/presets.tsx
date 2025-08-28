import Head from 'next/head'
import DocsLayout from '@/components/DocsLayout'
import CodeBlock from '@/components/CodeBlock'

export default function Presets() {
  const extendExample = `{
  "extends": "@hugsylabs/hugsy-compiler/presets/strict"
}`;

  const multiplePresetsExample = `{
  "extends": [
    "@hugsylabs/hugsy-compiler/presets/base",
    "@company/hugsy-preset-frontend"
  ]
}`;

  const overrideExample = `{
  "extends": "@hugsylabs/hugsy-compiler/presets/strict",
  "permissions": {
    "allow": [
      "Write(**/*.test.js)",
      "Bash(npm run dev)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}`;

  const customPresetExample = `{
  "name": "@company/hugsy-preset-frontend",
  "version": "1.0.0",
  "description": "Company frontend development preset",
  "permissions": {
    "allow": [
      "Read(**)",
      "Write(**/*.{js,jsx,ts,tsx})",
      "Write(**/*.{css,scss,sass})",
      "Write(**/*.{json,md})",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Bash(pnpm *)",
      "Bash(git *)"
    ],
    "deny": [
      "Write(**/node_modules/**)",
      "Write(**/.git/**)",
      "Write(**/build/**)",
      "Write(**/dist/**)",
      "Bash(rm -rf *)",
      "Bash(sudo *)"
    ]
  },
  "env": {
    "NODE_ENV": "development",
    "PRESET": "frontend"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write(**/*.{js,jsx,ts,tsx})",
        "command": "echo 'Code file modified'"
      }
    ]
  },
  "commands": {
    "presets": ["@hugsylabs/hugsy-compiler/presets/slash-commands-common"],
    "commands": {
      "build": {
        "description": "Build the frontend application",
        "content": "Run: npm run build"
      }
    }
  }
}`;

  return (
    <>
      <Head>
        <title>Presets - Hugsy Documentation</title>
      </Head>
      <DocsLayout title="Presets">
        <div className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Presets are pre-configured Hugsy configurations that you can extend and customize. 
            They provide a quick way to set up common development environments.
          </p>

          <h2 className="text-2xl font-bold">Using Presets</h2>
          <p>
            To use a preset, add the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">extends</code> field to your 
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-1">.hugsyrc.json</code> file:
          </p>

          <CodeBlock language="json" code={extendExample} />

          <h3 className="text-xl font-bold">Available Built-in Presets</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold">@hugsylabs/hugsy-compiler/presets/development</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full-featured development environment with permissive settings
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold">@hugsylabs/hugsy-compiler/presets/recommended</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Balanced configuration for most projects with reasonable defaults
              </p>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold">@hugsylabs/hugsy-compiler/presets/strict</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maximum security and restrictions for sensitive environments
              </p>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold">@hugsylabs/hugsy-compiler/presets/showcase</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Demonstrates all capabilities and features of Hugsy
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Multiple Presets</h2>
          <p>
            You can extend multiple presets. They are applied in order, with later presets overriding earlier ones:
          </p>

          <CodeBlock language="json" code={multiplePresetsExample} />

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Preset Resolution Order</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Base presets are loaded first (in order)</li>
              <li>Each preset's configuration is merged</li>
              <li>Your local configuration overrides preset values</li>
              <li>Plugins are applied last</li>
            </ol>
          </div>

          <h2 className="text-2xl font-bold">Overriding Preset Values</h2>
          <p>
            You can override specific values from a preset by defining them in your configuration:
          </p>

          <CodeBlock language="json" code={overrideExample} />

          <p className="text-sm text-gray-600 dark:text-gray-400">
            In this example, the additional permissions and environment variables are merged with the security preset's configuration.
          </p>

          <h2 className="text-2xl font-bold">Creating Custom Presets</h2>
          <p>
            You can create and share your own presets as npm packages. A preset is simply a JSON configuration file:
          </p>

          <CodeBlock language="json" code={customPresetExample} />

          <h3 className="text-xl font-bold">Publishing a Preset</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create an npm package with your preset configuration</li>
            <li>Export the configuration as <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">index.json</code></li>
            <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">hugsy-preset</code> keyword to package.json</li>
            <li>Publish to npm registry</li>
            <li>Users can now extend your preset using its package name</li>
          </ol>

          <h2 className="text-2xl font-bold">Preset vs Plugin</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3">When to use what?</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Use a Preset when:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>You want a complete configuration template</li>
                  <li>You're setting up standard environments (dev, staging, prod)</li>
                  <li>You want to share configurations across projects</li>
                  <li>You need static configuration values</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Use a Plugin when:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>You need dynamic configuration based on conditions</li>
                  <li>You want to transform existing configurations</li>
                  <li>You need to add computed values or logic</li>
                  <li>You want to react to other plugins or presets</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Start with a built-in preset and customize as needed</li>
              <li>Create team/organization presets for consistency</li>
              <li>Document what your preset includes and why</li>
              <li>Version your presets properly for compatibility</li>
              <li>Test presets across different project types</li>
            </ul>
          </div>
        </div>
      </DocsLayout>
    </>
  )
}