import { useState, useEffect } from 'react'
import Head from 'next/head'
import SidebarLayout from '../../components/SidebarLayout'
import { Bot, Check, Copy, ExternalLink, GitBranch, Terminal, Brain, Cpu } from 'lucide-react'
import SubagentsList from '../../components/marketplace/SubagentsList'
import PackageViewer from '../../components/marketplace/PackageViewer'

export default function Subagents() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SidebarLayout title="Subagents">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </SidebarLayout>
    )
  }

  if (selectedPackage) {
    return (
      <SidebarLayout title="Subagents">
        <PackageViewer 
          packageName={selectedPackage} 
          packageType="subagent"
          onBack={() => setSelectedPackage(null)}
        />
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="Subagents">
      <Head>
        <title>Subagents - Hugsy Marketplace</title>
        <meta name="description" content="Browse and install Hugsy subagents" />
      </Head>

      <div className="px-6 pt-2 pb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          AI-powered subagents that can autonomously handle complex tasks, integrate with tools, and enhance Claude Code's capabilities.
        </p>

        <SubagentsList onSelectPackage={setSelectedPackage} />
      </div>
    </SidebarLayout>
  )
}