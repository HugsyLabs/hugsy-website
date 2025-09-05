import Head from 'next/head'
import SidebarLayout from '@/components/SidebarLayout'

export default function Installation() {
  return (
    <>
      <Head>
        <title>Installation - Hugsy Documentation</title>
      </Head>
      <SidebarLayout title="Installation">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">System Requirements</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Node.js version 18.0 or higher</li>
            <li>npm version 8.0 or higher</li>
            <li>Operating System: macOS, Linux, or Windows 10+</li>
            <li>Claude Code latest version</li>
          </ul>

          <h2 className="text-2xl font-bold">Installation Methods</h2>
          
          <h3 className="text-xl font-semibold">npm (Recommended)</h3>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">npm</span>
            <span className="text-green-400"> install</span>
            <span className="text-yellow-400"> -g</span>
            <span className="text-white"> @hugsylabs/hugsy</span>
          </div>

          <h3 className="text-xl font-semibold">yarn</h3>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">yarn</span>
            <span className="text-green-400"> global add</span>
            <span className="text-white"> @hugsylabs/hugsy</span>
          </div>

          <h3 className="text-xl font-semibold">pnpm</h3>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">pnpm</span>
            <span className="text-green-400"> add</span>
            <span className="text-yellow-400"> -g</span>
            <span className="text-white"> @hugsylabs/hugsy</span>
          </div>

          <h2 className="text-2xl font-bold">Verify Installation</h2>
          <p>After installation, verify Hugsy is working:</p>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">$ </span>
            <span className="text-blue-400">hugsy</span>
            <span className="text-yellow-400"> --version</span>
          </div>
        </div>
      </SidebarLayout>
    </>
  )
}