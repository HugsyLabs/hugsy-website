import Head from 'next/head'
import Link from 'next/link'
import DocsLayout from '@/components/DocsLayout'
import CodeBlock from '@/components/CodeBlock'

export default function QuickStart() {
  return (
    <>
      <Head>
        <title>Quick Start - Hugsy Documentation</title>
      </Head>
      <DocsLayout title="Quick Start">
        <div className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">Get up and running with Hugsy in less than 5 minutes.</p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Prerequisites</h3>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>Node.js version 18.0 or higher</li>
              <li>npm or yarn package manager</li>
              <li>Claude Code installed and configured</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold">Installation</h2>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">npm</span>
            <span className="text-green-400"> install</span>
            <span className="text-yellow-400"> -g</span>
            <span className="text-white"> @hugsylabs/hugsy</span>
          </div>

          <p>Or with yarn:</p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">yarn</span>
            <span className="text-green-400"> global add</span>
            <span className="text-white"> @hugsylabs/hugsy</span>
          </div>

          <h2 className="text-2xl font-bold">Initialize Your Project</h2>
          <p>Navigate to your project directory and run:</p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">hugsy</span>
            <span className="text-green-400"> init</span>
          </div>

          <p>This will create a <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.hugsyrc.json</code> configuration file with default settings.</p>

          <h2 className="text-2xl font-bold">Basic Configuration</h2>
          <p>The configuration file looks like this:</p>
          <CodeBlock 
            language="json"
            code={JSON.stringify({
              "extends": "@hugsylabs/hugsy-compiler/presets/development",
              "permissions": {
                "allow": [
                  "Read(**)",
                  "Write(**/*.ts)",
                  "Bash(npm test)",
                  "Bash(git *)"
                ],
                "deny": [
                  "Write(**/node_modules/**)",
                  "Bash(rm -rf /)"
                ]
              },
              "env": {
                "NODE_ENV": "development"
              },
              "slashCommands": {
                "presets": ["@hugsy/slash-commands-common"]
              }
            }, null, 2)}
          />

          <h2 className="text-2xl font-bold">Apply Configuration</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Install and activate your configuration:</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
                <span className="text-gray-500">$ </span>
                <span className="text-blue-400">hugsy</span>
                <span className="text-green-400"> install</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Check configuration status:</h3>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
                <span className="text-gray-500">$ </span>
                <span className="text-blue-400">hugsy</span>
                <span className="text-green-400"> status</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Next Steps</h2>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3">You're all set!</h3>
            <p className="mb-4">Hugsy is now configured and ready to enhance your Claude Code experience.</p>
            <div className="space-y-2">
              <Link href="/docs/presets" className="block text-primary-500 hover:underline">
                → Learn about presets
              </Link>
              <Link href="/docs/plugins" className="block text-primary-500 hover:underline">
                → Explore plugin development
              </Link>
              <a href="https://github.com/HugsyLab/hugsy" className="block text-primary-500 hover:underline">
                → Explore the source code
              </a>
            </div>
          </div>
        </div>
      </DocsLayout>
    </>
  )
}