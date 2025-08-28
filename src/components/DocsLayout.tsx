import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home, 
  BookOpen, 
  Zap, 
  Settings, 
  Package, 
  Users,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'

interface DocsLayoutProps {
  children: React.ReactNode
  title?: string
}

const navigation = [
  { name: 'Introduction', href: '/docs', icon: Home },
  { name: 'Quick Start', href: '/docs/quick-start', icon: Zap },
  { name: 'Installation', href: '/docs/installation', icon: BookOpen },
  { name: 'Plugins', href: '/docs/plugins', icon: Package },
  { name: 'Presets', href: '/docs/presets', icon: Settings },
]

export default function DocsLayout({ children, title }: DocsLayoutProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass border-b border-gray-200/20 dark:border-gray-800/20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-xl">Hugsy</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Docs
              </Link>
              <Link href="https://github.com/HugsyLab/hugsy" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Link>
            </nav>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-64 fixed md:sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-950 z-40`}>
          <nav className="p-6 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
          {title && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <div className="h-1 w-20 bg-primary-500 rounded"></div>
            </div>
          )}
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}