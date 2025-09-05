import { useState, useEffect } from 'react'
import Head from 'next/head'
import SidebarLayout from '../../components/SidebarLayout'
import { Command, Check, Copy, ExternalLink, GitBranch, Terminal, Package } from 'lucide-react'
import CommandsList from '../../components/marketplace/CommandsList'
import PackageViewer from '../../components/marketplace/PackageViewer'

export default function Commands() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SidebarLayout title="Commands">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </SidebarLayout>
    )
  }

  if (selectedPackage) {
    return (
      <SidebarLayout title="Commands">
        <PackageViewer 
          packageName={selectedPackage} 
          packageType="command"
          onBack={() => setSelectedPackage(null)}
        />
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="Commands">
      <Head>
        <title>Commands - Hugsy Marketplace</title>
        <meta name="description" content="Browse and install Hugsy commands" />
      </Head>

      <div className="px-6 pt-2 pb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Slash commands that enhance Claude Code functionality with custom actions and workflows.
        </p>

        <CommandsList onSelectPackage={setSelectedPackage} />
      </div>
    </SidebarLayout>
  )
}