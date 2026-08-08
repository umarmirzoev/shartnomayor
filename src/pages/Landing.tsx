import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, Sparkles, ShieldCheck, FileStack, Users, History, BellRing, Lock,
  Wand2, ListChecks, FileDown, CheckCircle2, ScrollText, Scale, ChevronDown,
  Building2, Home, HandCoins, Briefcase as BriefcaseIcon,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AppMockup } from '@/components/landing/AppMockup'
import { useReveal } from '@/hooks/useReveal'
import { useState } from 'react'

export default function Landing() {
  return (
    <div className="reveal-root">
      <Hero />
      <StatsBar />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <TemplateLibrary />
      <AiExplainer />
      <Security />
      <Pricing />
      <Faq />
      <FinalCta />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(212,169,76,0.14),transparent)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-3.5 py-1.5 text-xs font-semibold text-gold-700">
            <Sparkles size={13} /> ИИ-ассистент нового поколения для юристов РТ
          </div>
          <h1 className="text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.4rem]">
            Черновик договора за минуты,
            <span className="relative whitespace-nowrap"> не часы</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            ШартномаЁр собирает первый черновик договора из проверенной библиотеки шаблонов по описанию сделки на естественном языке — а вы ведёте дела клиентов, отслеживаете версии и следите за изменениями законодательства в одном месте.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/app/login?mode=register" size="lg" iconRight={<ArrowUpRight size={18} />}>
              Начать бесплатно
            </ButtonLink>
            <ButtonLink to="/app/dashboard" variant="outline" size="lg">
              Посмотреть демо-кабинет
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Без карты для старта</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> 20 ИИ-запросов бесплатно</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> ИИ не подписывает документы</span>
          </div>
        </div>
        <AppMockup />
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { value: '4+', label: 'типа договоров в библиотеке шаблонов' },
    { value: '40+', label: 'проверенных пунктов (ClauseBlock)' },
    { value: 'RAG', label: 'подход — не свободная генерация ИИ' },
    { value: '3 слоя', label: 'защиты: аудит-лог, шифрование, роли' },
  ]
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="border-y border-ink-100 bg-white py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <div key={s.label} className="reveal text-center" style={{ transitionDelay: `${i * 80}ms` }}>
            <p className="font-serif-display text-3xl font-semibold text-ink-900">{s.value}</p>
            <p className="mt-1.5 text-xs leading-snug text-ink-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProblemSolution() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Badge tone="red">Знакомая проблема</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">
              Каждый договор юрист пишет заново — хотя 80% текста повторяется
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              Поставка, аренда, NDA, трудовой договор — типовая структура похожа от сделки к сделке, но составление всё равно занимает часы: копирование из старых файлов, ручная сверка формулировок, риск пропустить важный пункт об ответственности сторон.
            </p>
          </div>
          <div className="reveal" style={{ transitionDelay: '120ms' }}>
            <Badge tone="green">Решение ШартномаЁр</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">
              Опишите сделку на естественном языке — получите структурированный черновик
            </h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              ИИ подбирает подходящие пункты из проверенной библиотеки шаблонов (ClauseBlock) и собирает черновик — а не «сочиняет» текст с нуля. Вы правите, подтверждаете ответственность и экспортируете в .docx или .pdf.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const featureList = [
  { icon: Wand2, title: 'Сборка черновика ИИ', desc: 'Опишите сделку словами — ИИ соберёт черновик из библиотеки проверенных пунктов договора, а не сгенерирует текст «с нуля».' },
  { icon: FileStack, title: 'Библиотека шаблонов', desc: 'Поставка, аренда, NDA, трудовой договор — с готовыми блоками пунктов, которые можно комбинировать и переиспользовать.' },
  { icon: Users, title: 'Клиенты и дела', desc: 'Карточки клиентов, дела группируют документы одной сделки — вся история сотрудничества в одном месте.' },
  { icon: History, title: 'Журнал версий', desc: 'Каждая правка — неизменимый снимок документа. Всегда можно увидеть, что и когда изменилось и кем.' },
  { icon: BellRing, title: 'Мониторинг законодательства', desc: 'Уведомления об изменениях в законе, привязанные к затронутым делам и типам договоров.' },
  { icon: Lock, title: 'Аудит и защита данных', desc: 'Ролевой доступ, шифрование в покое и при передаче, полный аудит-лог: кто, когда, что открыл или изменил.' },
]

function Features() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="features" ref={ref} className="bg-ink-950 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="gold">Возможности</Badge>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Всё, что нужно для договорной работы — в одном интерфейсе</h2>
          <p className="mt-4 leading-relaxed text-ink-300">
            Базовая версия — библиотека шаблонов, ведение дел, экспорт документа — работает и приносит пользу без ИИ вообще. ИИ — слой поверх неё.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureList.map((f, i) => (
            <div
              key={f.title}
              className="reveal rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-gold-500/40 hover:bg-white/[0.06]"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
                <f.icon size={20} />
              </span>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const steps = [
  { n: '01', title: 'Опишите сделку', desc: 'Юрист коротко описывает сделку на естественном языке и указывает ключевые условия: стороны, предмет, сумму, сроки.' },
  { n: '02', title: 'ИИ собирает черновик', desc: 'Порт IAiDraftingService подбирает подходящие пункты (ClauseBlock) из библиотеки шаблонов и формирует структурированный черновик.' },
  { n: '03', title: 'Юрист правит и проверяет', desc: 'Ручная правка текста, сверка с делом клиента, при необходимости — пересборка черновика с учётом новых вводных.' },
  { n: '04', title: 'Подтверждение и экспорт', desc: 'Юрист подтверждает ответственность за итоговый текст и экспортирует документ в .docx или .pdf для согласования с клиентом.' },
]

function HowItWorks() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="how" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="blue">Как это работает</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">От описания сделки до готового документа</h2>
          <p className="mt-4 text-ink-500">Без клиентского портала на MVP: юрист — единственный пользователь приложения, согласование с клиентом происходит вне системы.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="reveal relative" style={{ transitionDelay: `${i * 90}ms` }}>
              {i < steps.length - 1 && <div className="absolute right-0 top-6 hidden h-px w-full bg-gradient-to-r from-ink-200 to-transparent lg:block" />}
              <span className="font-serif-display text-4xl font-semibold text-ink-200">{s.n}</span>
              <h3 className="mt-3 text-base font-bold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const templates = [
  { icon: HandCoins, title: 'Договор поставки', tag: 'Коммерческое право', clauses: 5 },
  { icon: Home, title: 'Договор аренды', tag: 'Недвижимость', clauses: 4 },
  { icon: ScrollText, title: 'Соглашение о конфиденциальности', tag: 'NDA', clauses: 3 },
  { icon: BriefcaseIcon, title: 'Трудовой договор', tag: 'Трудовое право', clauses: 4 },
]

function TemplateLibrary() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="templates" ref={ref} className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Badge tone="gold">Библиотека шаблонов</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">Стартовый набор типов договоров</h2>
            <p className="mt-4 text-ink-500">Каждый шаблон — набор переиспользуемых пунктов (ClauseBlock), из которых ИИ собирает черновик под конкретную сделку.</p>
          </div>
          <ButtonLink to="/app/templates" variant="outline" iconRight={<ArrowUpRight size={16} />}>Открыть библиотеку</ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t, i) => (
            <Card key={t.title} className="reveal p-6 transition hover:-translate-y-1 hover:shadow-soft" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-gold-500">
                <t.icon size={19} />
              </span>
              <h3 className="text-[15px] font-bold text-ink-900">{t.title}</h3>
              <p className="mt-1 text-xs text-ink-400">{t.tag}</p>
              <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                <ListChecks size={13} /> {t.clauses} готовых пунктов
              </p>
            </Card>
          ))}
        </div>
        <p className="reveal mt-6 text-xs text-ink-400">
          Документы, требующие нотариального заверения (недвижимость, доверенности, наследство), сознательно исключены из библиотеки на уровне продукта.
        </p>
      </div>
    </section>
  )
}

function AiExplainer() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="ai" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="reveal">
            <Badge tone="blue">Как устроен ИИ</Badge>
            <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">Ближе к RAG, чем к «напиши мне договор»</h2>
            <p className="mt-4 leading-relaxed text-ink-500">
              ИИ собирает черновик не свободной генерацией, а по извлечённым из библиотеки блокам, подходящим под описанную сделку. Это предсказуемее для юриста и снижает риск, что ИИ сгенерирует пункт, противоречащий законодательству Республики Таджикистан.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Провайдер: Gemini API — с возможностью смены на платный тариф без изменений в бизнес-логике',
                'Redis считает ИИ-запросы по пользователю за период — прозрачный лимит на бесплатном тарифе',
                'Порт IAiDraftingService отделяет бизнес-логику от конкретного провайдера ИИ',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Card className="reveal border-gold-300 bg-gold-100/60 p-7" style={{ transitionDelay: '100ms' }}>
            <div className="flex items-center gap-2.5 text-gold-700">
              <Scale size={20} />
              <p className="text-sm font-bold uppercase tracking-wide">Ключевой принцип продукта</p>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-800">
              ИИ не заменяет юриста и не подписывает документы — он собирает первый черновик и снимает рутину. Юрист всегда проверяет и подтверждает ответственность за итоговый текст перед экспортом.
            </p>
            <div className="mt-6 rounded-xl border border-gold-300 bg-white/70 p-4 text-xs leading-relaxed text-ink-600">
              Бесплатный уровень ИИ-провайдера может использовать данные запросов для улучшения моделей. Для реальных документов клиентов рекомендуется платный тариф или явное предупреждение пользователю.
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

const securityPoints = [
  { icon: FileStack, title: 'Раздельное хранение', desc: 'Содержимое документа — в файловом хранилище, метаданные — в PostgreSQL. Упрощает шифрование и резервное копирование каждого по отдельности.' },
  { icon: History, title: 'Неизменяемые версии', desc: 'Каждая правка документа — отдельная запись. Текущая версия — лишь указатель на последнюю в истории.' },
  { icon: ShieldCheck, title: 'Шифрование и роли', desc: 'Шифрование данных в покое и при передаче; юрист видит только свои дела.' },
  { icon: BellRing, title: 'Полный аудит-лог', desc: 'Кто, когда, что открыл, изменил или удалил — фиксируется без исключений.' },
]

function Security() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section id="security" ref={ref} className="bg-ink-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal max-w-2xl">
          <Badge tone="green">Хранение и защита данных</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">Данные клиентов защищены по умолчанию</h2>
          <p className="mt-4 text-ink-500">Полное удаление по запросу — реальное уничтожение содержимого, а не пометка «архивный», в соответствии с законом РТ «О защите персональных данных».</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {securityPoints.map((p, i) => (
            <Card key={p.title} className="reveal p-6" style={{ transitionDelay: `${i * 70}ms` }}>
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-gold-500">
                <p.icon size={18} />
              </span>
              <h3 className="text-sm font-bold text-ink-900">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const ref = useReveal<HTMLDivElement>()
  const plans = [
    {
      name: 'Бесплатный',
      price: '0 сомони',
      desc: 'Чтобы попробовать продукт на реальных делах',
      features: ['20 ИИ-запросов в месяц', 'Библиотека из 4 типов договоров', 'Клиенты и дела без ограничений', 'Экспорт в .docx и .pdf', 'Журнал версий документа'],
      cta: 'Начать бесплатно',
      variant: 'outline' as const,
    },
    {
      name: 'Про',
      price: 'по запросу',
      desc: 'Для практикующих юристов и небольших фирм',
      features: ['Без лимита ИИ-запросов', 'Приоритетная сборка черновика', 'Данные не используются для обучения ИИ', 'Мониторинг изменений законодательства', 'Приоритетная поддержка'],
      cta: 'Обсудить подключение',
      variant: 'primary' as const,
      highlighted: true,
    },
  ]
  return (
    <section id="pricing" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="reveal text-center">
          <Badge tone="gold" className="mx-auto">Тарифы</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">Простая модель без скрытых условий</h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-500">Лимиты ИИ-запросов считаются с первого дня — оплата пока не подключена в MVP-версии.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {plans.map((p, i) => (
            <Card
              key={p.name}
              className={`reveal p-8 ${p.highlighted ? 'border-2 border-ink-900 shadow-soft' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p.highlighted && <Badge tone="gold" className="mb-4">Рекомендуем</Badge>}
              <h3 className="text-lg font-bold text-ink-900">{p.name}</h3>
              <p className="mt-1 text-3xl font-extrabold text-ink-950">{p.price}</p>
              <p className="mt-2 text-sm text-ink-400">{p.desc}</p>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <ButtonLink to="/app/login?mode=register" variant={p.variant} className="mt-8 w-full">
                {p.cta}
              </ButtonLink>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const faqItems = [
  { q: 'ИИ заменяет юриста при составлении договора?', a: 'Нет. ИИ собирает первый черновик из проверенной библиотеки шаблонов и снимает рутину — юрист всегда проверяет, правит и подтверждает ответственность за итоговый текст перед экспортом.' },
  { q: 'Можно ли работать без ИИ вообще?', a: 'Да. Базовая версия — библиотека шаблонов, ведение дел, экспорт документа — работает и приносит пользу без ИИ. ИИ — дополнительный слой поверх неё.' },
  { q: 'Какие договоры сознательно не поддерживаются?', a: 'Документы, требующие нотариального заверения — сделки с недвижимостью, часть доверенностей, наследство. Они исключены из продукта на уровне доменной модели.' },
  { q: 'Есть ли клиентский портал?', a: 'На MVP — нет. Юрист скачивает или печатает документ и согласовывает условия с клиентом вне приложения.' },
  { q: 'Что происходит с данными клиентов на бесплатном тарифе ИИ?', a: 'Бесплатный уровень ИИ-провайдера может использовать данные запросов для улучшения моделей. Для реальных документов клиентов рекомендуется платный тариф или явное предупреждение пользователю.' },
  { q: 'Как хранятся версии документа?', a: 'Каждая правка — отдельная неизменяемая запись в журнале версий. Текущая версия — лишь указатель на последнюю, ничего не перезаписывается.' },
]

function Faq() {
  const ref = useReveal<HTMLDivElement>()
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section id="faq" ref={ref} className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="reveal text-center">
          <Badge tone="neutral" className="mx-auto">Частые вопросы</Badge>
          <h2 className="mt-4 text-2xl font-bold text-ink-950 sm:text-3xl">Отвечаем на главное</h2>
        </div>
        <div className="mt-10 divide-y divide-ink-100 rounded-2xl border border-ink-100">
          {faqItems.map((item, i) => (
            <div key={item.q} className="reveal" style={{ transitionDelay: `${i * 40}ms` }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-ink-900">{item.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-ink-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-ink-500">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <section ref={ref} className="px-5 pb-24 lg:px-8">
      <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink-950 px-8 py-16 text-center text-white sm:px-16">
        <Building2 className="mx-auto mb-5 text-gold-400" size={30} />
        <h2 className="text-2xl font-bold sm:text-3xl">Соберите первый черновик за 5 минут</h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-300">
          Без карты, без установки. Опишите сделку — увидите, как ИИ собирает договор из библиотеки проверенных пунктов.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/app/login?mode=register" variant="secondary" size="lg" iconRight={<ArrowUpRight size={18} />}>
            Начать бесплатно
          </ButtonLink>
          <ButtonLink to="/app/dashboard" variant="ghost" size="lg" className="text-white hover:bg-white/10">
            Открыть демо-кабинет
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
