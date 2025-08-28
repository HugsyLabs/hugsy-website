import React from 'react'

interface CodeBlockProps {
  code: string
  language?: 'json' | 'bash' | 'javascript' | 'typescript'
}

export default function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  if (language === 'json') {
    // Simple JSON syntax highlighting
    const highlightJSON = (str: string) => {
      // Ensure proper formatting
      str = str.trim()
      // Replace quotes around keys
      str = str.replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      // Replace string values in arrays
      str = str.replace(/:\s*\[\s*"([^"]*)"(?:,\s*"([^"]*)")*\s*\]/g, (match) => {
        return match.replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
      })
      // Replace string values
      str = str.replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
      // Replace boolean values
      str = str.replace(/:\s*(true|false)/g, ': <span class="text-yellow-400">$1</span>')
      // Replace numbers
      str = str.replace(/:\s*(\d+)/g, ': <span class="text-purple-400">$1</span>')
      // Replace brackets
      str = str.replace(/(\[|\]|\{|\})/g, '<span class="text-gray-400">$1</span>')
      return str
    }

    return (
      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
        <pre 
          className="text-sm font-mono text-white whitespace-pre m-0"
          dangerouslySetInnerHTML={{ __html: highlightJSON(code.trim()) }} 
        />
      </div>
    )
  }

  // Default bash/command line display
  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm font-mono">
        <code className="text-green-400">{code}</code>
      </pre>
    </div>
  )
}