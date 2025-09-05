import { useState, useEffect } from 'react'
import Head from 'next/head'
import SidebarLayout from '../../components/SidebarLayout'
import { Puzzle, Check, Copy, ExternalLink, GitBranch, Terminal, FileCode, Code } from 'lucide-react'
import PluginsList from '../../components/marketplace/PluginsList'
import PackageViewer from '../../components/marketplace/PackageViewer'

export default function Plugins() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SidebarLayout title="Plugins">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </SidebarLayout>
    )
  }

  if (selectedPackage) {
    return (
      <SidebarLayout title="Plugins">
        <PackageViewer 
          packageName={selectedPackage} 
          packageType="plugin"
          onBack={() => setSelectedPackage(null)}
        />
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="Plugins">
      <Head>
        <title>Plugins - Hugsy Marketplace</title>
        <meta name="description" content="Browse and install Hugsy plugins" />
      </Head>

      <div className="px-6 pt-2 pb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Extend Hugsy functionality with plugins that add new features, hooks, and capabilities.
        </p>

        <PluginsList onSelectPackage={setSelectedPackage} />
      </div>
    </SidebarLayout>
  )
}