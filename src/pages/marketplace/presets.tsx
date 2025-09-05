import { useState, useEffect } from 'react'
import Head from 'next/head'
import SidebarLayout from '../../components/SidebarLayout'
import { Package, Check, Copy, ExternalLink, Star, Shield, Code, Zap } from 'lucide-react'
import PresetsList from '../../components/marketplace/PresetsList'
import PackageViewer from '../../components/marketplace/PackageViewer'

export default function Presets() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <SidebarLayout title="Presets">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </SidebarLayout>
    )
  }

  if (selectedPackage) {
    return (
      <SidebarLayout title="Presets">
        <PackageViewer 
          packageName={selectedPackage} 
          packageType="preset"
          onBack={() => setSelectedPackage(null)}
        />
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="Presets">
      <Head>
        <title>Presets - Hugsy Marketplace</title>
        <meta name="description" content="Browse and install Hugsy presets" />
      </Head>

      <div className="px-6 pt-2 pb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Pre-configured templates that bundle plugins, commands, and settings for specific use cases.
        </p>

        <PresetsList onSelectPackage={setSelectedPackage} />
      </div>
    </SidebarLayout>
  )
}