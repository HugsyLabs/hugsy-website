import dynamic from 'next/dynamic'
import { loader } from '@monaco-editor/react'

// Configure monaco-editor loader
if (typeof window !== 'undefined') {
  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
    }
  })
}

const Editor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.Editor),
  { ssr: false }
)

interface LazyEditorProps {
  height?: string | number
  defaultLanguage?: string
  value?: string
  theme?: string
  options?: any
}

export function LazyEditor(props: LazyEditorProps) {
  return <Editor {...props} />
}