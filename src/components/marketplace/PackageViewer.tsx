import { useState, useEffect, useCallback } from 'react'
import { 
  ArrowLeft, 
  Package, 
  Download, 
  Star, 
  Calendar,
  User,
  Github,
  ExternalLink,
  Copy,
  Check,
  FileJson,
  Shield,
  Lock,
  Unlock,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  FileCode,
  Book,
  Tag,
  GitBranch,
  Scale,
  Eye,
  FileText
} from 'lucide-react'
import { 
  getPackageInfo, 
  getPackageJson,
  getReadme,
  getFileContent,
  getFileList,
  getDownloadStats,
  extractGitHubInfo,
  formatDate,
  formatFileSize,
  isMinified
} from '../../services/npmRegistry'
import { LazyEditor } from '../LazyEditor'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PackageViewerProps {
  packageName: string
  packageType: 'preset' | 'plugin' | 'command' | 'subagent'
  onBack: () => void
}

interface TabProps {
  label: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function PackageViewer({ packageName, packageType, onBack }: PackageViewerProps) {
  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [packageJson, setPackageJson] = useState<any>(null)
  const [readme, setReadme] = useState<string>('')
  const [downloads, setDownloads] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['permissions', 'configuration'])
  )
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loadingFile, setLoadingFile] = useState(false)
  const [codeWarning, setCodeWarning] = useState<string | null>(null)
  const [fileList, setFileList] = useState<any[]>([])
  const [loadingFileList, setLoadingFileList] = useState(false)

  const fetchPackageData = useCallback(async () => {
    setLoading(true)
    try {
      const [info, json, readmeContent, stats] = await Promise.all([
        getPackageInfo(packageName),
        getPackageJson(packageName),
        getReadme(packageName),
        getDownloadStats(packageName, 'last-week')
      ])
      
      setPackageInfo(info)
      setPackageJson(json)
      setReadme(readmeContent || '')
      setDownloads(stats?.downloads ?? 0)
    } catch (error) {
      console.error('Error fetching package details:', error)
    } finally {
      setLoading(false)
    }
  }, [packageName])

  useEffect(() => {
    fetchPackageData()
  }, [fetchPackageData])

  const copyConfig = () => {
    let config = ''
    if (packageType === 'preset') {
      config = `"extends": "${packageName}"`
    } else if (packageType === 'plugin') {
      config = `"plugins": ["${packageName}"]`
    } else {
      config = `"commands": ["${packageName}"]`
    }
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyInstallCommand = () => {
    const command = `npm install ${packageName}`
    navigator.clipboard.writeText(command)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2000)
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const renderFileTree = (files: any[]) => {
    const getFileIcon = (fileName: string) => {
      if (fileName.endsWith('.json')) return <FileJson className="w-4 h-4 text-gray-500" />
      if (fileName.endsWith('.md')) return <FileText className="w-4 h-4 text-gray-500" />
      if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.d.ts')) {
        return <FileCode className="w-4 h-4 text-blue-500" />
      }
      if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
        return <FileCode className="w-4 h-4 text-yellow-500" />
      }
      return <FileCode className="w-4 h-4 text-gray-500" />
    }

    const handleFileClick = async (filePath: string) => {
      setSelectedFile(filePath)
      setLoadingFile(true)
      setCodeWarning(null)
      try {
        const content = await getFileContent(packageName, filePath)
        if (content) {
          setFileContent(content)
          if (isMinified(content)) {
            setCodeWarning('This code has been minified/obfuscated and may be difficult to read')
          }
        } else {
          setFileContent('// Unable to load file content')
        }
      } catch (error) {
        setFileContent('// Error loading file')
      } finally {
        setLoadingFile(false)
      }
    }

    return files.map((file: any) => (
      <div key={file.path}>
        <button
          onClick={() => handleFileClick(file.path)}
          className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-between ${
            selectedFile === file.path ? 'bg-blue-100 dark:bg-blue-900/20' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {getFileIcon(file.path)}
            <span className="truncate">{file.path}</span>
          </div>
          {file.size && (
            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
          )}
        </button>
        {file.files && file.files.length > 0 && (
          <div className="ml-4">
            {renderFileTree(file.files)}
          </div>
        )}
      </div>
    ))
  }

  const renderPermissions = () => {
    const permissions = packageJson?.hugsy?.permissions || packageJson?.preset?.permissions
    
    if (!permissions) {
      return <p className="text-gray-500 dark:text-gray-400 text-sm">No permissions configured</p>
    }
    
    return (
      <div className="space-y-4">
        {permissions.allow && permissions.allow.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <h4 className="font-medium text-green-700 dark:text-green-400 mb-3 flex items-center space-x-2">
              <Unlock className="w-4 h-4" />
              <span>Allowed ({permissions.allow.length})</span>
            </h4>
            <div className="space-y-1">
              {permissions.allow.map((perm: string) => (
                <div key={perm} className="flex items-center space-x-2 py-1">
                  <Unlock className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <code className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {perm}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {permissions.deny && permissions.deny.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Denied ({permissions.deny.length})</span>
            </h4>
            <div className="space-y-1">
              {permissions.deny.map((perm: string) => (
                <div key={perm} className="flex items-center space-x-2 py-1">
                  <Lock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <code className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {perm}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {permissions.ask && permissions.ask.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Ask on use ({permissions.ask.length})</span>
            </h4>
            <div className="space-y-1">
              {permissions.ask.map((perm: string) => (
                <div key={perm} className="flex items-center space-x-2 py-1">
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                  <code className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {perm}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderConfiguration = () => {
    const config = packageJson?.hugsy || packageJson?.preset || {}
    
    if (packageType === 'preset') {
      return (
        <div className="space-y-4">
          {config.plugins && config.plugins.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Included Plugins</h4>
              <div className="space-y-2">
                {config.plugins.map((plugin: string) => (
                  <div key={plugin} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-mono">{plugin}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {config.env && Object.keys(config.env).length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Environment Variables</h4>
              <div className="space-y-1">
                {Object.entries(config.env).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-gray-600 dark:text-gray-400">{key}:</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {config.extends && (
            <div>
              <h4 className="font-medium text-sm mb-2">Extends</h4>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm font-mono">{config.extends}</span>
              </div>
            </div>
          )}
        </div>
      )
    }

    // For plugins and commands, show configuration example
    return (
      <div className="bg-gray-900 dark:bg-gray-950 rounded p-4">
        <pre className="text-xs text-gray-300 overflow-x-auto">
          <code>{JSON.stringify(config, null, 2)}</code>
        </pre>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const githubInfo = extractGitHubInfo(packageInfo?.repository?.url)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {packageType}s
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {packageName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {packageInfo?.description || 'No description available'}
              </p>
            </div>
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded text-sm">
              v{packageInfo?.version || '0.0.0'}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{downloads.toLocaleString()} weekly downloads</span>
            </div>
            
            {packageInfo?.license && (
              <div className="flex items-center gap-1">
                <Scale className="w-4 h-4" />
                <span>{packageInfo.license}</span>
              </div>
            )}

            {packageInfo?.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{typeof packageInfo.author === 'string' ? packageInfo.author : packageInfo.author.name}</span>
              </div>
            )}

            {packageInfo?.time?.modified && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(packageInfo.time.modified)}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyConfig}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Config'}</span>
            </button>

            <button
              onClick={copyInstallCommand}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {copiedInstall ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedInstall ? 'Copied!' : 'Copy Install'}</span>
            </button>

            <a
              href={`https://www.npmjs.com/package/${packageName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on NPM</span>
            </a>

            {githubInfo && (
              <a
                href={`https://github.com/${githubInfo.owner}/${githubInfo.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {['overview', 'readme', 'code', 'dependencies', 'versions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Installation</h3>
                <div className="bg-gray-900 dark:bg-gray-950 rounded p-3">
                  <code className="text-sm text-gray-300">npm install {packageName}</code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage in .hugsyrc</h3>
                <div className="bg-gray-900 dark:bg-gray-950 rounded p-3">
                  <pre className="text-sm text-gray-300">
{`{
  ${packageType === 'preset' ? `"extends": "${packageName}"` : 
    packageType === 'plugin' ? `"plugins": ["${packageName}"]` :
    `"commands": ["${packageName}"]`}
}`}
                  </pre>
                </div>
              </div>

              {packageType === 'preset' && (
                <div>
                  <button
                    onClick={() => toggleSection('permissions')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Permissions</span>
                    </div>
                    {expandedSections.has('permissions') ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  {expandedSections.has('permissions') && (
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                      {renderPermissions()}
                    </div>
                  )}
                </div>
              )}

              <div>
                <button
                  onClick={() => toggleSection('configuration')}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    <span className="font-medium">Configuration</span>
                  </div>
                  {expandedSections.has('configuration') ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </button>
                {expandedSections.has('configuration') && (
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                    {renderConfiguration()}
                  </div>
                )}
              </div>

              {packageJson?.keywords && packageJson.keywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {packageJson.keywords.map((keyword: string) => (
                      <span key={keyword} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* README Tab */}
          {activeTab === 'readme' && (
            <div className="max-w-none">
              {readme ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ children, ...props }) => (
                          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto" {...props}>
                            {children}
                          </pre>
                        ),
                        code: ({ children, ...props }) => (
                          <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm" {...props}>
                            {children}
                          </code>
                        ),
                        h1: ({ children, ...props }) => (
                          <h1 className="text-2xl font-bold mb-4 mt-6" {...props}>{children}</h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className="text-xl font-semibold mb-3 mt-5" {...props}>{children}</h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className="text-lg font-semibold mb-2 mt-4" {...props}>{children}</h3>
                        ),
                        p: ({ children, ...props }) => (
                          <p className="mb-4" {...props}>{children}</p>
                        ),
                        ul: ({ children, ...props }) => (
                          <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>
                        ),
                        ol: ({ children, ...props }) => (
                          <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>
                        ),
                        li: ({ children, ...props }) => (
                          <li className="mb-1" {...props}>{children}</li>
                        ),
                        a: ({ children, href, ...props }) => (
                          <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                          </a>
                        ),
                        blockquote: ({ children, ...props }) => (
                          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4" {...props}>
                            {children}
                          </blockquote>
                        ),
                        table: ({ children, ...props }) => (
                          <table className="border-collapse w-full my-4" {...props}>
                            {children}
                          </table>
                        ),
                        th: ({ children, ...props }) => (
                          <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800" {...props}>
                            {children}
                          </th>
                        ),
                        td: ({ children, ...props }) => (
                          <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
                            {children}
                          </td>
                        )
                      }}
                    >
                      {readme}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No README available</p>
              )}
            </div>
          )}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && (
            <div className="space-y-6">
              {packageJson?.dependencies && Object.keys(packageJson.dependencies).length > 0 ? (
                <div>
                  <h3 className="font-medium mb-3">Dependencies</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {Object.entries(packageJson.dependencies).map(([name, version]) => (
                      <div key={name} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="font-mono text-sm">{name}</span>
                        <span className="text-sm text-gray-500">{String(version)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No dependencies</p>
              )}

              {packageJson?.devDependencies && Object.keys(packageJson.devDependencies).length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Dev Dependencies</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    {Object.entries(packageJson.devDependencies).map(([name, version]) => (
                      <div key={name} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="font-mono text-sm">{name}</span>
                        <span className="text-sm text-gray-500">{String(version)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && (
            <div className="flex h-[600px] -m-6">
              {/* File list sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-auto">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Package Files
                  </h3>
                  {!loadingFileList && fileList.length === 0 && (
                    <button
                      onClick={async () => {
                        setLoadingFileList(true)
                        try {
                          const files = await getFileList(packageName)
                          if (files) {
                            setFileList(files)
                          }
                        } catch (error) {
                          console.error('Error loading file list:', error)
                        } finally {
                          setLoadingFileList(false)
                        }
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Load all files
                    </button>
                  )}
                </div>
                <div className="p-2">
                  {loadingFileList ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : fileList.length > 0 ? (
                    <div className="space-y-1">
                      {renderFileTree(fileList)}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                      onClick={async () => {
                        setSelectedFile('package.json')
                        setLoadingFile(true)
                        setCodeWarning(null)
                        try {
                          const content = await getFileContent(packageName, 'package.json')
                          if (content) {
                            setFileContent(content)
                            if (isMinified(content)) {
                              setCodeWarning('This code has been minified/obfuscated and may be difficult to read')
                            }
                          } else {
                            setFileContent('// Unable to load file content')
                          }
                        } catch (error) {
                          setFileContent('// Error loading file')
                        } finally {
                          setLoadingFile(false)
                        }
                      }}
                      className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                        selectedFile === 'package.json' ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <FileJson className="w-4 h-4 inline mr-2 text-gray-500" />
                      package.json
                    </button>
                    {packageJson?.main && (
                      <button
                        onClick={async () => {
                          setSelectedFile(packageJson.main)
                          setLoadingFile(true)
                          setCodeWarning(null)
                          try {
                            const content = await getFileContent(packageName, packageJson.main)
                            if (content) {
                              setFileContent(content)
                              if (isMinified(content)) {
                                setCodeWarning('This code has been minified/obfuscated and may be difficult to read')
                              }
                            } else {
                              setFileContent('// Unable to load file content')
                            }
                          } catch (error) {
                            setFileContent('// Error loading file')
                          } finally {
                            setLoadingFile(false)
                          }
                        }}
                        className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                          selectedFile === packageJson?.main ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <FileCode className="w-4 h-4 inline mr-2 text-gray-500" />
                        {packageJson.main}
                      </button>
                    )}
                    {packageJson?.types && (
                      <button
                        onClick={async () => {
                          setSelectedFile(packageJson.types)
                          setLoadingFile(true)
                          setCodeWarning(null)
                          try {
                            const content = await getFileContent(packageName, packageJson.types)
                            if (content) {
                              setFileContent(content)
                            } else {
                              setFileContent('// Unable to load file content')
                            }
                          } catch (error) {
                            setFileContent('// Error loading file')
                          } finally {
                            setLoadingFile(false)
                          }
                        }}
                        className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                          selectedFile === packageJson?.types ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <FileText className="w-4 h-4 inline mr-2 text-gray-500" />
                        {packageJson.types}
                      </button>
                    )}
                  </div>
                  )}
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                    <p className="mb-2">Browse all files on:</p>
                    <a
                      href={`https://unpkg.com/browse/${packageName}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>unpkg</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Code viewer */}
              <div className="flex-1 flex flex-col">
                {codeWarning && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 border-b border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-300">{codeWarning}</span>
                    </div>
                  </div>
                )}
                {selectedFile ? (
                  <div className="flex-1">
                    {loadingFile ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <LazyEditor
                        height="100%"
                        defaultLanguage={selectedFile.endsWith('.json') ? 'json' : selectedFile.endsWith('.md') ? 'markdown' : selectedFile.endsWith('.d.ts') || selectedFile.endsWith('.ts') ? 'typescript' : 'javascript'}
                        value={fileContent}
                        theme="vs-dark"
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          wordWrap: 'on'
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p>Select a file to view content</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <div>
              <h3 className="font-semibold mb-3">Version History</h3>
              <div className="space-y-2">
                {(() => {
                  // Get all versions from packageInfo
                  let versions: string[] = []
                  if (packageInfo?.versions) {
                    versions = Object.keys(packageInfo.versions)
                  } else if (packageInfo?.time) {
                    // Fallback: use time object to get versions
                    versions = Object.keys(packageInfo.time).filter(v => v !== 'created' && v !== 'modified')
                  }
                  
                  // If still no versions, show current version
                  if (versions.length === 0 && packageInfo?.version) {
                    versions = [packageInfo.version]
                  }
                  
                  if (versions.length === 0) {
                    return <p className="text-gray-500 dark:text-gray-400">No version history available</p>
                  }
                  
                  return versions
                    .sort((a, b) => {
                      // Sort versions by publish time (newest first)
                      const timeA = packageInfo?.time?.[a]
                      const timeB = packageInfo?.time?.[b]
                      if (!timeA || !timeB) {
                        // Fallback to semantic version sorting
                        return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' })
                      }
                      return new Date(timeB).getTime() - new Date(timeA).getTime()
                    })
                    .slice(0, 20)
                    .map((version: string) => {
                      const publishTime = packageInfo?.time?.[version]
                      const isLatest = version === (packageInfo?.['dist-tags']?.latest || packageInfo?.version)
                      
                      return (
                        <div key={version} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{version}</span>
                            {isLatest && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                                Latest
                              </span>
                            )}
                            {packageInfo?.['dist-tags']?.next === version && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                Next
                              </span>
                            )}
                            {packageInfo?.['dist-tags']?.beta === version && (
                              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">
                                Beta
                              </span>
                            )}
                          </div>
                          {publishTime && (
                            <span className="text-sm text-gray-500">
                              {formatDate(publishTime)}
                            </span>
                          )}
                        </div>
                      )
                    })
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}