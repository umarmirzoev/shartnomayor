import type { Dict } from '@/lib/i18n'
import { localizedFillClauses } from '@/lib/seedText'

export function simulateAiGeneration(templateId: string, values: Record<string, string>, t: Dict): Promise<string> {
  return new Promise((resolve) => {
    const delay = 1600 + Math.random() * 900
    setTimeout(() => resolve(localizedFillClauses(templateId, values, t)), delay)
  })
}
