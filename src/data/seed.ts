import type { Client, Case, Draft, Template, ClauseBlock, LegislationAlert, DocumentVersion, AuditLogEntry, Lawyer, AiUsage } from '@/lib/types'

export const seedLawyer: Lawyer = {
  id: 'lw-1',
  fullName: 'Фарход Расулов',
  email: 'farhod.rasulov@shartnomayor.tj',
  firm: 'Юридическое бюро «Расулов и партнёры»',
  plan: 'free',
}

export const seedAiUsage: AiUsage = { used: 7, limit: 20, periodLabel: 'этот месяц' }

export const seedTemplates: Template[] = [
  {
    id: 'tpl-supply',
    title: 'Договор поставки',
    category: 'Коммерческое право',
    description: 'Поставка товара между юридическими лицами с графиком, приёмкой и ответственностью сторон.',
    fields: [
      { key: 'supplier', label: 'Поставщик', placeholder: 'ООО «Заравшон Трейд»' },
      { key: 'buyer', label: 'Покупатель', placeholder: 'ООО «Хирмон»' },
      { key: 'goods', label: 'Предмет поставки', placeholder: 'Строительные материалы, 40 тонн' },
      { key: 'amount', label: 'Сумма договора', placeholder: '185 000 сомони' },
      { key: 'deadline', label: 'Срок поставки', placeholder: 'до 30 сентября 2026' },
    ],
    clauseIds: ['cl-supply-1', 'cl-supply-2', 'cl-supply-3', 'cl-supply-4', 'cl-supply-5'],
  },
  {
    id: 'tpl-lease',
    title: 'Договор аренды',
    category: 'Недвижимость (без нотариата)',
    description: 'Аренда нежилого помещения — офис, склад, торговая точка.',
    fields: [
      { key: 'landlord', label: 'Арендодатель', placeholder: 'Каримов К.К.' },
      { key: 'tenant', label: 'Арендатор', placeholder: 'ИП Назарова С.' },
      { key: 'object', label: 'Объект аренды', placeholder: 'Нежилое помещение, 64 м², г. Душанбе' },
      { key: 'rent', label: 'Арендная плата', placeholder: '4 500 сомони / месяц' },
      { key: 'term', label: 'Срок аренды', placeholder: '12 месяцев с правом пролонгации' },
    ],
    clauseIds: ['cl-lease-1', 'cl-lease-2', 'cl-lease-3', 'cl-lease-4'],
  },
  {
    id: 'tpl-nda',
    title: 'Соглашение о конфиденциальности (NDA)',
    category: 'Коммерческое право',
    description: 'Защита конфиденциальной информации при переговорах и сотрудничестве.',
    fields: [
      { key: 'partyA', label: 'Сторона 1', placeholder: 'ООО «Помир Технолоджис»' },
      { key: 'partyB', label: 'Сторона 2', placeholder: 'Инвестор — Азимов Ф.А.' },
      { key: 'purpose', label: 'Цель раскрытия информации', placeholder: 'Due diligence перед инвестиционной сделкой' },
      { key: 'term', label: 'Срок конфиденциальности', placeholder: '3 года с даты подписания' },
    ],
    clauseIds: ['cl-nda-1', 'cl-nda-2', 'cl-nda-3'],
  },
  {
    id: 'tpl-labor',
    title: 'Трудовой договор',
    category: 'Трудовое право',
    description: 'Приём сотрудника на постоянную работу с испытательным сроком.',
    fields: [
      { key: 'employer', label: 'Работодатель', placeholder: 'ООО «Сомон Логистика»' },
      { key: 'employee', label: 'Работник', placeholder: 'Юсупова Н.Р.' },
      { key: 'position', label: 'Должность', placeholder: 'Менеджер по продажам' },
      { key: 'salary', label: 'Оклад', placeholder: '3 200 сомони / месяц' },
      { key: 'probation', label: 'Испытательный срок', placeholder: '3 месяца' },
    ],
    clauseIds: ['cl-labor-1', 'cl-labor-2', 'cl-labor-3', 'cl-labor-4'],
  },
]

export const seedClauses: ClauseBlock[] = [
  { id: 'cl-supply-1', templateId: 'tpl-supply', title: 'Предмет договора', optional: false, body: 'Поставщик {{supplier}} обязуется передать в собственность Покупателю {{buyer}}, а Покупатель обязуется принять и оплатить следующий товар: {{goods}}.' },
  { id: 'cl-supply-2', templateId: 'tpl-supply', title: 'Цена и порядок расчётов', optional: false, body: 'Общая сумма договора составляет {{amount}}. Оплата производится в безналичном порядке в течение 5 (пяти) банковских дней с момента подписания настоящего договора либо согласно графику платежей, указанному в Приложении № 1.' },
  { id: 'cl-supply-3', templateId: 'tpl-supply', title: 'Сроки и порядок поставки', optional: false, body: 'Поставка товара осуществляется {{deadline}}. Датой поставки считается дата подписания сторонами акта приёма-передачи товара.' },
  { id: 'cl-supply-4', templateId: 'tpl-supply', title: 'Ответственность сторон', optional: false, body: 'За нарушение сроков поставки Поставщик уплачивает Покупателю пеню в размере 0,1% от стоимости недопоставленного товара за каждый день просрочки, но не более 10% от суммы договора.' },
  { id: 'cl-supply-5', templateId: 'tpl-supply', title: 'Разрешение споров', optional: true, body: 'Все споры и разногласия, возникающие из настоящего договора, стороны разрешают путём переговоров, а при недостижении согласия — в судебном порядке по месту нахождения ответчика в соответствии с законодательством Республики Таджикистан.' },
  { id: 'cl-lease-1', templateId: 'tpl-lease', title: 'Предмет аренды', optional: false, body: 'Арендодатель {{landlord}} передаёт, а Арендатор {{tenant}} принимает во временное владение и пользование объект: {{object}}.' },
  { id: 'cl-lease-2', templateId: 'tpl-lease', title: 'Арендная плата', optional: false, body: 'Размер арендной платы составляет {{rent}} и вносится Арендатором не позднее 5 (пятого) числа каждого месяца путём перечисления на расчётный счёт Арендодателя.' },
  { id: 'cl-lease-3', templateId: 'tpl-lease', title: 'Срок действия договора', optional: false, body: 'Настоящий договор заключён на срок: {{term}}. При отсутствии возражений сторон за 30 дней до истечения срока договор считается продлённым на тот же срок.' },
  { id: 'cl-lease-4', templateId: 'tpl-lease', title: 'Права и обязанности сторон', optional: true, body: 'Арендатор обязан использовать объект по назначению, поддерживать его в надлежащем состоянии и не производить перепланировку без письменного согласия Арендодателя.' },
  { id: 'cl-nda-1', templateId: 'tpl-nda', title: 'Предмет соглашения', optional: false, body: '{{partyA}} и {{partyB}} (далее — «Стороны») заключили настоящее соглашение в целях защиты конфиденциальной информации, раскрываемой в связи с: {{purpose}}.' },
  { id: 'cl-nda-2', templateId: 'tpl-nda', title: 'Обязательства сторон', optional: false, body: 'Получающая сторона обязуется не разглашать конфиденциальную информацию третьим лицам и использовать её исключительно в целях, указанных в настоящем соглашении.' },
  { id: 'cl-nda-3', templateId: 'tpl-nda', title: 'Срок действия', optional: false, body: 'Обязательства по настоящему соглашению действуют в течение {{term}} и сохраняют силу после прекращения основных переговоров или сотрудничества сторон.' },
  { id: 'cl-labor-1', templateId: 'tpl-labor', title: 'Предмет договора', optional: false, body: '{{employer}} (далее — «Работодатель») принимает {{employee}} (далее — «Работник») на должность «{{position}}».' },
  { id: 'cl-labor-2', templateId: 'tpl-labor', title: 'Оплата труда', optional: false, body: 'Работнику устанавливается должностной оклад в размере {{salary}}, выплачиваемый два раза в месяц в порядке, установленном Трудовым кодексом Республики Таджикистан.' },
  { id: 'cl-labor-3', templateId: 'tpl-labor', title: 'Испытательный срок', optional: true, body: 'Работнику устанавливается испытательный срок продолжительностью {{probation}} с целью проверки соответствия занимаемой должности.' },
  { id: 'cl-labor-4', templateId: 'tpl-labor', title: 'Права и обязанности сторон', optional: false, body: 'Работник обязуется добросовестно исполнять свои трудовые обязанности, соблюдать правила внутреннего трудового распорядка и трудовую дисциплину.' },
]

export const seedClients: Client[] = [
  { id: 'cli-1', name: 'ООО «Помир Технолоджис»', type: 'company', contact: '+992 37 221 4501 · info@pomir-tech.tj', note: 'IT-компания, разработка ПО', createdAt: '2026-05-14' },
  { id: 'cli-2', name: 'Каримов Комрон Каримович', type: 'individual', contact: '+992 93 500 1188', note: 'Собственник коммерческой недвижимости', createdAt: '2026-06-02' },
  { id: 'cli-3', name: 'ООО «Заравшон Трейд»', type: 'company', contact: '+992 44 600 7712 · office@zarafshon-trade.tj', createdAt: '2026-06-20' },
  { id: 'cli-4', name: 'ИП Назарова Ситора', type: 'individual', contact: '+992 98 777 3320', note: 'Розничная торговля', createdAt: '2026-07-01' },
  { id: 'cli-5', name: 'ООО «Сомон Логистика»', type: 'company', contact: '+992 37 224 9090 · hr@somon-logistics.tj', createdAt: '2026-07-18' },
]

export const seedCases: Case[] = [
  { id: 'case-1', clientId: 'cli-1', title: 'Инвестиционная сделка — раунд A', status: 'active', createdAt: '2026-06-01' },
  { id: 'case-2', clientId: 'cli-2', title: 'Аренда офиса на пр. Рудаки', status: 'active', createdAt: '2026-06-10' },
  { id: 'case-3', clientId: 'cli-3', title: 'Поставка стройматериалов — партия Q3', status: 'active', createdAt: '2026-06-25' },
  { id: 'case-4', clientId: 'cli-4', title: 'Аренда торговой точки, ТЦ «Садбарг»', status: 'closed', createdAt: '2026-05-02' },
  { id: 'case-5', clientId: 'cli-5', title: 'Найм менеджера по продажам', status: 'active', createdAt: '2026-07-20' },
]

export function fillClauses(templateId: string, values: Record<string, string>) {
  const tpl = seedTemplates.find((t) => t.id === templateId)!
  return tpl.clauseIds
    .map((cid) => seedClauses.find((c) => c.id === cid)!)
    .map((clause) => {
      let body = clause.body
      Object.entries(values).forEach(([k, v]) => {
        body = body.replaceAll(`{{${k}}}`, v)
      })
      return `## ${clause.title}\n${body}`
    })
    .join('\n\n')
}

const ndaContent = fillClauses('tpl-nda', {
  partyA: 'ООО «Помир Технолоджис»',
  partyB: 'Инвестор — Азимов Ф.А.',
  purpose: 'Due diligence перед инвестиционной сделкой',
  term: '3 года с даты подписания',
})

const leaseContent = fillClauses('tpl-lease', {
  landlord: 'Каримов К.К.',
  tenant: 'ООО «Помир Технолоджис»',
  object: 'Нежилое помещение, 92 м², пр. Рудаки, г. Душанбе',
  rent: '6 800 сомони / месяц',
  term: '24 месяца с правом пролонгации',
})

const supplyContent = fillClauses('tpl-supply', {
  supplier: 'ООО «Заравшон Трейд»',
  buyer: 'ООО «Хирмон Строй»',
  goods: 'Строительные материалы (цемент, арматура), 40 тонн',
  amount: '185 000 сомони',
  deadline: 'до 30 сентября 2026',
})

const laborContent = fillClauses('tpl-labor', {
  employer: 'ООО «Сомон Логистика»',
  employee: 'Юсупова Нилуфар Рустамовна',
  position: 'Менеджер по продажам',
  salary: '3 200 сомони / месяц',
  probation: '3 месяца',
})

export const seedVersions: DocumentVersion[] = [
  { id: 'v-1-1', draftId: 'draft-1', number: 1, content: ndaContent, createdAt: '2026-06-02 10:14', note: 'Черновик собран ИИ по описанию сделки', author: 'ИИ-ассистент' },
  { id: 'v-1-2', draftId: 'draft-1', number: 2, content: ndaContent + '\n\nДополнительное условие\n\nСторона, нарушившая условия конфиденциальности, возмещает документально подтверждённые убытки другой стороны.', createdAt: '2026-06-03 16:40', note: 'Добавлен пункт об ответственности за нарушение', author: 'Фарход Расулов' },
  { id: 'v-2-1', draftId: 'draft-2', number: 1, content: leaseContent, createdAt: '2026-06-11 09:02', note: 'Черновик собран ИИ по описанию сделки', author: 'ИИ-ассистент' },
  { id: 'v-3-1', draftId: 'draft-3', number: 1, content: supplyContent, createdAt: '2026-06-25 14:22', note: 'Черновик собран ИИ по описанию сделки', author: 'ИИ-ассистент' },
  { id: 'v-3-2', draftId: 'draft-3', number: 2, content: supplyContent.replace('0,1%', '0,15%'), createdAt: '2026-06-27 11:05', note: 'Увеличена пеня за просрочку поставки по просьбе клиента', author: 'Фарход Расулов' },
  { id: 'v-5-1', draftId: 'draft-5', number: 1, content: laborContent, createdAt: '2026-07-21 08:50', note: 'Черновик собран ИИ по описанию сделки', author: 'ИИ-ассистент' },
]

export const seedDrafts: Draft[] = [
  { id: 'draft-1', caseId: 'case-1', templateId: 'tpl-nda', title: 'NDA — Помир Технолоджис / Инвестор', status: 'ready', currentVersionId: 'v-1-2', responsibilityConfirmed: true, createdAt: '2026-06-02', updatedAt: '2026-06-03' },
  { id: 'draft-2', caseId: 'case-2', templateId: 'tpl-lease', title: 'Аренда офиса — пр. Рудаки', status: 'in_review', currentVersionId: 'v-2-1', responsibilityConfirmed: false, createdAt: '2026-06-11', updatedAt: '2026-06-11' },
  { id: 'draft-3', caseId: 'case-3', templateId: 'tpl-supply', title: 'Поставка стройматериалов Q3', status: 'exported', currentVersionId: 'v-3-2', responsibilityConfirmed: true, createdAt: '2026-06-25', updatedAt: '2026-06-27' },
  { id: 'draft-5', caseId: 'case-5', templateId: 'tpl-labor', title: 'Трудовой договор — Юсупова Н.Р.', status: 'draft', currentVersionId: 'v-5-1', responsibilityConfirmed: false, createdAt: '2026-07-21', updatedAt: '2026-07-21' },
]

export const seedAlerts: LegislationAlert[] = [
  {
    id: 'alert-1',
    title: 'Изменения в Гражданском кодексе РТ: сроки исковой давности по договорам поставки',
    summary: 'Уточнён порядок исчисления сроков исковой давности по коммерческим поставкам. Рекомендуется проверить пункт об ответственности сторон в активных договорах поставки.',
    affectedTemplateIds: ['tpl-supply'],
    date: '2026-07-28',
    read: false,
    severity: 'important',
  },
  {
    id: 'alert-2',
    title: 'Обновлены минимальные требования к трудовым договорам',
    summary: 'Внесены изменения в порядок оформления испытательного срока и обязательные условия трудового договора.',
    affectedTemplateIds: ['tpl-labor'],
    date: '2026-07-15',
    read: false,
    severity: 'critical',
  },
  {
    id: 'alert-3',
    title: 'Разъяснение по договорам аренды нежилых помещений',
    summary: 'Опубликовано разъяснение о порядке пролонгации договоров аренды без нотариального удостоверения.',
    affectedTemplateIds: ['tpl-lease'],
    date: '2026-06-30',
    read: true,
    severity: 'info',
  },
]

export const seedAudit: AuditLogEntry[] = [
  { id: 'a-1', action: 'Экспортирован документ в .docx', target: 'Поставка стройматериалов Q3', actor: 'Фарход Расулов', date: '2026-06-27 12:10' },
  { id: 'a-2', action: 'Изменена версия черновика', target: 'Поставка стройматериалов Q3', actor: 'Фарход Расулов', date: '2026-06-27 11:05' },
  { id: 'a-3', action: 'Создан черновик по описанию сделки (ИИ)', target: 'Трудовой договор — Юсупова Н.Р.', actor: 'ИИ-ассистент', date: '2026-07-21 08:50' },
  { id: 'a-4', action: 'Добавлен новый клиент', target: 'ООО «Сомон Логистика»', actor: 'Фарход Расулов', date: '2026-07-18 09:30' },
]
