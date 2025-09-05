import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Sparkles, 
  BookOpen, 
  Package, 
  Puzzle, 
  Command, 
  ChevronRight,
  ChevronDown,
  FileText,
  Rocket,
  Download,
  Bot
} from 'lucide-react'

interface SidebarLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function SidebarLayout({ children, title }: SidebarLayoutProps) {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['marketplace', 'docs']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const navigation = [
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Sparkles,
      items: [
        { path: '/marketplace/presets', label: 'Presets', icon: Package },
        { path: '/marketplace/plugins', label: 'Plugins', icon: Puzzle },
        { path: '/marketplace/commands', label: 'Commands', icon: Command },
        { path: '/marketplace/subagents', label: 'Subagents', icon: Bot },
      ]
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: BookOpen,
      items: [
        { path: '/docs', label: 'Overview', icon: FileText },
        { path: '/docs/quick-start', label: 'Quick Start', icon: Rocket },
        { path: '/docs/installation', label: 'Installation', icon: Download },
        { path: '/docs/presets', label: 'Presets Guide', icon: Package },
        { path: '/docs/plugins', label: 'Plugins Guide', icon: Puzzle },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="w-64 px-6 py-4 border-r border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-xl">Hugsy</span>
            </Link>
          </div>
          <div className="flex-1 px-6 py-4 flex items-center justify-between">
            {title && (
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            )}
            <div className="flex items-center space-x-6">
              <Link href="https://github.com/HugsyLabs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                GitHub
              </Link>
              <Link href="https://discord.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            {navigation.map((section) => {
              const SectionIcon = section.icon
              const isExpanded = expandedSections.has(section.id)
              
              return (
                <div key={section.id} className="mb-6">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <SectionIcon className="w-4 h-4 mr-2" />
                      {section.label}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon
                        const isActive = router?.pathname === item.path
                        
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`
                              flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                              ${isActive 
                                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                              }
                            `}
                          >
                            <ItemIcon className="w-4 h-4 mr-2" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}