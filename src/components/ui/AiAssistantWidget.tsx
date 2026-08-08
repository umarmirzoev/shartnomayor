import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send, FileText, ListChecks, Bot } from 'lucide-react'
import clsx from 'clsx'
import { useT } from '@/lib/i18n/context'
import { getAssistantReply, type TemplateCard } from '@/lib/aiAssistant'

interface Msg {
  id: string
  role: 'user' | 'assistant'
  text: string
  templateCard?: TemplateCard
}

export function AiAssistantWidget() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: 'greeting', role: 'assistant', text: t.aiAssistant.greeting }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 260)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  function send(text: string) {
    const value = text.trim()
    if (!value || thinking) return
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text: value }])
    setInput('')
    setThinking(true)
    const delay = 650 + Math.random() * 700
    setTimeout(() => {
      const reply = getAssistantReply(value, t)
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', text: reply.text, templateCard: reply.templateCard }])
      setThinking(false)
    }, delay)
  }

  return (
    <div className="no-print">
      {/* ---- Плавающая кнопка ---- */}
      <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
        <div className="group relative flex items-center justify-end">
          <span
            className={clsx(
              'pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-soft transition-all duration-300 dark:bg-white dark:text-ink-950',
              'translate-x-2 group-hover:translate-x-0 group-hover:opacity-100'
            )}
          >
            {open ? t.aiAssistant.close : t.aiAssistant.fabHint}
          </span>

          {!open && (
            <span
              className="absolute inset-0 rounded-full"
              style={{ animation: 'ai-fab-ring 2.4s ease-out infinite' }}
              aria-hidden
            />
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={t.aiAssistant.fabLabel}
            className={clsx(
              'relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-ink-900 to-ink-700 text-gold-400 shadow-soft transition-all duration-300',
              'hover:scale-110 hover:shadow-[0_8px_30px_-6px_rgba(212,169,76,0.65)] active:scale-95',
              'dark:from-white dark:to-ink-100 dark:text-ink-900'
            )}
          >
            <Sparkles
              size={24}
              className={clsx('transition-transform duration-300', open ? 'scale-0 rotate-90' : 'scale-100 rotate-0 group-hover:rotate-12')}
            />
            <X
              size={22}
              className={clsx('absolute transition-transform duration-300', open ? 'scale-100 rotate-0' : 'scale-0 -rotate-90')}
            />
          </button>
        </div>
      </div>

      {/* ---- Панель чата ---- */}
      <div
        className={clsx(
          'fixed bottom-24 right-5 z-[70] flex w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-ink-900/15 transition-all duration-300 dark:border-white/10 dark:bg-ink-900 sm:bottom-28 sm:right-6',
          open ? 'h-[70vh] max-h-[560px] opacity-100' : 'pointer-events-none h-0 max-h-0 opacity-0'
        )}
        style={open ? { animation: 'ai-panel-in 0.32s cubic-bezier(0.16,1,0.3,1)' } : undefined}
      >
        <div className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-ink-900 to-ink-800 px-4 py-3.5 dark:border-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
            <Bot size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{t.aiAssistant.panelTitle}</p>
            <p className="truncate text-[11px] text-ink-300">{t.aiAssistant.panelSubtitle}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-ink-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <div key={m.id} style={{ animation: 'ai-msg-in 0.25s ease-out' }}>
              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                  m.role === 'user'
                    ? 'ml-auto rounded-br-sm bg-ink-900 text-white dark:bg-white dark:text-ink-950'
                    : 'rounded-bl-sm bg-ink-50 text-ink-800 dark:bg-white/[0.06] dark:text-ink-100'
                )}
              >
                {m.text}
              </div>
              {m.templateCard && <TemplateCardView card={m.templateCard} />}
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-ink-50 px-3.5 py-3 dark:bg-white/[0.06]" style={{ width: 52 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-ink-400 dark:bg-ink-300"
                  style={{ animation: 'ai-dot 1.1s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}

          {messages.length <= 1 && !thinking && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {t.aiAssistant.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink-200 px-3 py-1.5 text-[11.5px] font-medium text-ink-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-100 hover:text-ink-900 dark:border-white/15 dark:text-ink-300 dark:hover:bg-gold-500/10 dark:hover:text-gold-300"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(input) }}
          className="flex items-center gap-2 border-t border-ink-100 p-3 dark:border-white/10"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.aiAssistant.inputPlaceholder}
            className="flex-1 rounded-xl border border-ink-200 bg-transparent px-3.5 py-2.5 text-[13px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-gold-500 dark:border-white/15 dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-gold-400 transition-all duration-200 hover:scale-105 hover:bg-ink-800 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 dark:bg-white dark:text-ink-900"
            aria-label={t.aiAssistant.send}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}

function TemplateCardView({ card }: { card: TemplateCard }) {
  const t = useT()
  return (
    <div
      className="mt-2 max-w-[92%] rounded-2xl border border-gold-300/60 bg-gold-100/50 p-3.5 transition-all duration-300 hover:border-gold-400 hover:shadow-soft dark:border-gold-500/25 dark:bg-gold-500/[0.06]"
      style={{ animation: 'ai-msg-in 0.3s ease-out' }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-gold-400 dark:bg-white dark:text-ink-900">
          <FileText size={14} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink-900 dark:text-white">{card.title}</p>
          <p className="truncate text-[10.5px] text-ink-500 dark:text-ink-400">{card.category}</p>
        </div>
      </div>
      <p className="mb-2.5 text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">{card.description}</p>

      <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">{t.aiAssistant.templateFieldsLabel}</p>
      <div className="mb-2.5 flex flex-wrap gap-1">
        {card.fields.map((f) => (
          <span key={f} className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-ink-700 dark:bg-white/10 dark:text-ink-200">
            {f}
          </span>
        ))}
      </div>

      <p className="mb-1 flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">
        <ListChecks size={11} /> {t.aiAssistant.templateClausesLabel}
      </p>
      <ul className="mb-2.5 space-y-0.5">
        {card.clauses.map((c) => (
          <li key={c} className="text-[11.5px] text-ink-700 dark:text-ink-200">· {c}</li>
        ))}
      </ul>

      <p className="text-[11px] italic text-ink-500 dark:text-ink-400">{t.aiAssistant.templateOutro}</p>
    </div>
  )
}
