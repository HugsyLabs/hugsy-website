import Head from 'next/head'
import Link from 'next/link'
import DocsLayout from '@/components/DocsLayout'

export default function DocsIndex() {
  return (
    <>
      <Head>
        <title>Documentation - Hugsy</title>
      </Head>
      <DocsLayout title="Welcome to Hugsy">
        <div className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">Hugsy is a powerful CLI tool designed to enhance your Claude Code experience through plugins, team configurations, and a thriving ecosystem of community-built presets.</p>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">What is Hugsy?</h2>
            <p className="text-gray-700 dark:text-gray-300">Hugsy extends Claude Code's capabilities by providing a plugin management system, team configuration sharing, and TypeScript-first development experience.</p>
          </div>

          <h2 className="text-2xl font-bold mt-8">Core Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <div>
                <strong>Plugin Management</strong> - Install and manage plugins to extend functionality
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <div>
                <strong>Team Configuration</strong> - Share configurations via .hugsyrc.json
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <div>
                <strong>TypeScript Support</strong> - Full type safety and IntelliSense
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary-500 mr-2">•</span>
              <div>
                <strong>Preset System</strong> - Pre-configured plugin collections
              </div>
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Getting Started</h2>
          <p>Ready to enhance your Claude Code workflow? Check out our Quick Start guide to get up and running in minutes.</p>
          
          <div className="mt-6">
            <Link href="/docs/quick-start" className="btn-primary">
              Get Started →
            </Link>
          </div>
        </div>
      </DocsLayout>
    </>
  )
}