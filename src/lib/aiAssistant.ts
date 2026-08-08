// Правило-ориентированный «ИИ»-ассистент для лендинга и кабинета: подбирает
// ответ из локализованной базы знаний (t.aiAssistant.knowledge) и умеет по
// ключевым словам собрать карточку шаблона договора из библиотеки шаблонов.
// Реальный вызов LLM подключается сюда одной функцией — компонент виджета не
// меняется (см. src/lib/api.ts — тот же принцип, что и для остального продукта).
import type { Dict } from '@/lib/i18n'
import { localizedTemplates, localizedClauses } from '@/lib/seedText'

export interface TemplateCard {
  title: string
  category: string
  description: string
  fields: string[]
  clauses: string[]
}

export interface AssistantReply {
  text: string
  templateCard?: TemplateCard
}

function normalize(input: string): string {
  return input.trim().toLowerCase()
}

function matchTemplateId(input: string, t: Dict): string | null {
  const entries = Object.entries(t.aiAssistant.templateKeywords)
  for (const [templateId, keywords] of entries) {
    if (keywords.some((kw) => input.includes(kw.toLowerCase()))) return templateId
  }
  return null
}

const TEMPLATE_REQUEST_HINTS = [
  'шаблон', 'созда', 'сдела', 'собер', 'состав', 'нужен', 'нужна', 'хочу', // ru
  'шаблон', 'соз', 'мехо', 'лозим', 'кун', // tg (шаблон общий)
  'template', 'create', 'build', 'make', 'draft', 'generate', 'need', 'want', // en
]

export function getAssistantReply(rawInput: string, t: Dict): AssistantReply {
  const input = normalize(rawInput)
  if (!input) return { text: t.aiAssistant.fallback }

  const templateId = matchTemplateId(input, t)
  const looksLikeTemplateRequest = templateId && TEMPLATE_REQUEST_HINTS.some((h) => input.includes(h))

  if (templateId && (looksLikeTemplateRequest || input.length < 40)) {
    const tpl = localizedTemplates(t).find((tp) => tp.id === templateId)
    if (tpl) {
      const clauses = localizedClauses(t)
      const clauseTitles = tpl.clauseIds.map((cid) => clauses.find((c) => c.id === cid)?.title).filter((x): x is string => !!x)
      return {
        text: t.aiAssistant.templateIntro.replace('{title}', tpl.title),
        templateCard: {
          title: tpl.title,
          category: tpl.category,
          description: tpl.description,
          fields: tpl.fields.map((f) => f.label),
          clauses: clauseTitles,
        },
      }
    }
  }

  // if it clearly wants a template but we couldn't tell which type
  if (TEMPLATE_REQUEST_HINTS.some((h) => input.includes(h)) && (input.includes('шаблон') || input.includes('template') || input.includes('договор') || input.includes('шартнома') || input.includes('contract'))) {
    return { text: t.aiAssistant.templateNotFound }
  }

  const hit = t.aiAssistant.knowledge.find((entry) => entry.keywords.some((kw) => input.includes(kw.toLowerCase())))
  if (hit) return { text: hit.answer }

  return { text: t.aiAssistant.fallback }
}
