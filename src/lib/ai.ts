import { fillClauses } from '@/data/seed'

export function simulateAiGeneration(templateId: string, values: Record<string, string>): Promise<string> {
  return new Promise((resolve) => {
    const delay = 1600 + Math.random() * 900
    setTimeout(() => resolve(fillClauses(templateId, values)), delay)
  })
}

export const aiStages = [
  'Анализ описания сделки…',
  'Подбор пунктов из библиотеки шаблонов…',
  'Сборка черновика договора…',
  'Проверка на противоречия…',
]
