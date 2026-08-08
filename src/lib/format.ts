export interface ContentBlock {
  heading: string
  body: string
}

// Parses "## Heading\nBody text" blocks separated by blank lines.
export function parseContent(content: string): ContentBlock[] {
  return content
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n')
      if (lines[0].startsWith('## ')) {
        return { heading: lines[0].replace('## ', ''), body: lines.slice(1).join('\n').trim() }
      }
      return { heading: '', body: chunk }
    })
}
