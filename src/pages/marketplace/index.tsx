import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import SidebarLayout from '../../components/SidebarLayout'
import { Package, Puzzle, Command, Bot, ArrowRight } from 'lucide-react'

export default function Marketplace() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    {
      id: 'presets',
      title: 'Presets',
      description: 'Pre-configured templates for different use cases',
      icon: Package,
      link: '/marketplace/presets',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'plugins',
      title: 'Plugins',
      description: 'Extend Hugsy functionality with plugins',
      icon: Puzzle,
      link: '/marketplace/plugins',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'commands',
      title: 'Commands',
      description: 'Slash commands for Claude Code',
      icon: Command,
      link: '/marketplace/commands',
      color: 'bg-green-500',
      lightColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'subagents',
      title: 'Subagents',
      description: 'AI-powered autonomous agents for complex tasks',
      icon: Bot,
      link: '/marketplace/subagents',
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ]

  return (
    <SidebarLayout title="Marketplace">
      <Head>
        <title>Hugsy Marketplace</title>
        <meta name="description" content="Browse and discover Hugsy presets, plugins, and commands" />
      </Head>

      {mounted && (
        <div className="p-6">
          {/* Hero Section */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              Discover and install presets, plugins, and commands to enhance your Hugsy configuration.
              Browse our collection of official and community packages.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={category.link}
                className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className={`w-16 h-16 ${category.lightColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${category.textColor}`} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                    Browse {category.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 How to use packages
          </h3>
          <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <li>1. Browse the marketplace and find packages you need</li>
            <li>2. Click on a package to view details</li>
            <li>3. Click "Copy Config" to copy the configuration snippet</li>
            <li>4. Paste it into your local .hugsyrc file</li>
            <li>5. Run `hugsy compile` to apply the changes</li>
          </ol>
        </div>
        </div>
      )}
    </SidebarLayout>
  )
}