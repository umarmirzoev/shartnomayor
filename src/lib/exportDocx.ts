import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import { parseContent } from '@/lib/format'

export async function exportDraftToDocx(title: string, content: string, meta: { caseTitle: string; clientName: string; date: string }) {
  const blocks = parseContent(content)

  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 30 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `г. Душанбе, ${meta.date}`, size: 20, color: '565F96' })],
    }),
  ]

  blocks.forEach((block, i) => {
    if (block.heading) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
          children: [new TextRun({ text: `${i + 1}. ${block.heading}`, bold: true, size: 24 })],
        })
      )
    }
    block.body.split('\n').forEach((line) => {
      children.push(
        new Paragraph({
          spacing: { after: 160 },
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: line, size: 22 })],
        })
      )
    })
  })

  children.push(
    new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: '_________________________', size: 22 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Подпись стороны 1', size: 20, italics: true, color: '565F96' })] }),
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '_________________________', size: 22 })] }),
    new Paragraph({ children: [new TextRun({ text: 'Подпись стороны 2', size: 20, italics: true, color: '565F96' })] })
  )

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = `${title.replace(/[^\p{L}\p{N}\- ]/gu, '').trim().replace(/\s+/g, '_')}.docx`
  saveAs(blob, filename)
}
