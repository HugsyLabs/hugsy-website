import Head from 'next/head'
import Link from 'next/link'
import { 
  Terminal, 
  Zap, 
  Package, 
  Users, 
  GitBranch, 
  Shield,
  ArrowRight,
  CheckCircle,
  Code2,
  Sparkles
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Plugin Ecosystem',
      description: 'Rich collection of plugins to extend Claude Code functionality',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed with zero-config setup and instant loading',
    },
    {
      icon: Users,
      title: 'Team Ready',
      description: 'Share configurations and presets across your entire team',
    },
    {
      icon: Shield,
      title: 'Type Safe',
      description: 'Built with TypeScript for excellent developer experience',
    },
  ]

  return (
    <>
      <Head>
        <title>Hugsy - Supercharge Your Claude Code Experience</title>
        <meta name="description" content="A powerful CLI tool for managing Claude Code configurations and plugins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-dark-950 dark:to-dark-900">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 glass border-b border-gray-200/20 dark:border-gray-800/20">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="font-bold text-xl">Hugsy</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                Docs
              </Link>
              <Link href="/docs/quick-start" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                Quick Start
              </Link>
              <Link href="https://github.com/HugsyLab/hugsy" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Claude Code Settings Plugins and Presets!
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Supercharge Your
                <span className="gradient-text block">Claude Code Experience</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                A powerful CLI tool that extends Claude Code with plugins, team configurations, 
                and a thriving ecosystem of community-built presets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/docs/quick-start" className="btn-primary group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="https://github.com/HugsyLab/hugsy" className="btn-secondary">
                  View on GitHub
                </Link>
              </div>

              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <code className="text-green-400 font-mono">npm install -g @hugsylabs/hugsy</code>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText('npm install -g @hugsylabs/hugsy')}
                    className="text-gray-400 hover:text-white transition px-3 py-1 rounded hover:bg-gray-800"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Powerful features to enhance your development workflow
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 card-hover"
                >
                  <div className="bg-primary-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-dark-900/50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started in Minutes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Three simple steps to enhance your Claude Code workflow
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Install Hugsy</h3>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  npm install -g @hugsylabs/hugsy
                </code>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Initialize Project</h3>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  hugsy init
                </code>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Install Configuration</h3>
                <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  hugsy install
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Start using Hugsy to enhance your Claude Code experience
              </p>
              <Link href="/docs/quick-start" className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <span className="font-semibold">Hugsy</span>
              </div>
              <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/docs">Documentation</Link>
                <Link href="https://github.com/HugsyLab/hugsy">GitHub</Link>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} HugsyLab. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}