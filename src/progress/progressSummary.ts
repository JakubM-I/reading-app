import type {
  ProgressBadge,
  ProgressSessionRecord,
  StoredProgress,
} from './progressTypes'

export interface PeriodProgressSummary {
  label: string
  rangeLabel: string
  points: number
  sessions: number
  tasks: number
  independent: number
  activeDays: number
  difficultItems: string[]
  badges: ProgressBadge[]
}

export interface ProgressOverview {
  today: PeriodProgressSummary
  week: PeriodProgressSummary
  month: PeriodProgressSummary
  totalPoints: number
  totalSessions: number
  recentDifficultItems: string[]
  badges: ProgressBadge[]
}

export const getProgressOverview = (
  progress: StoredProgress,
  now = new Date(),
): ProgressOverview => {
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  return {
    today: buildPeriodSummary(
      'Dzisiaj',
      formatDateRange(todayStart, todayEnd),
      progress,
      todayStart,
      todayEnd,
    ),
    week: buildPeriodSummary(
      'Ten tydzień',
      formatDateRange(weekStart, weekEnd),
      progress,
      weekStart,
      weekEnd,
    ),
    month: buildPeriodSummary(
      'Ten miesiąc',
      formatMonth(now),
      progress,
      monthStart,
      monthEnd,
    ),
    totalPoints: progress.totalPoints,
    totalSessions: progress.sessions.length,
    recentDifficultItems: progress.difficultItems.slice(0, 6),
    badges: progress.badges,
  }
}

const buildPeriodSummary = (
  label: string,
  rangeLabel: string,
  progress: StoredProgress,
  startDate: Date,
  endDate: Date,
): PeriodProgressSummary => {
  const sessions = progress.sessions.filter((session) =>
    isWithinPeriod(new Date(session.completedAt), startDate, endDate),
  )
  const badges = progress.badges.filter((badge) =>
    isWithinPeriod(new Date(badge.earnedAt), startDate, endDate),
  )

  return {
    label,
    rangeLabel,
    points: sumSessions(sessions, (session) => session.totalPoints),
    sessions: sessions.length,
    tasks: sumSessions(sessions, (session) => session.totalTasks),
    independent: sumSessions(sessions, (session) => session.counts.independent),
    activeDays: countActiveDays(sessions),
    difficultItems: getFrequentDifficultItems(sessions, 5),
    badges,
  }
}

const sumSessions = (
  sessions: ProgressSessionRecord[],
  getValue: (session: ProgressSessionRecord) => number,
) => sessions.reduce((sum, session) => sum + getValue(session), 0)

const getFrequentDifficultItems = (
  sessions: ProgressSessionRecord[],
  limit: number,
) => {
  const counts = new Map<string, number>()

  for (const session of sessions) {
    for (const item of session.difficultTasks) {
      counts.set(item, (counts.get(item) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pl'))
    .slice(0, limit)
    .map(([item]) => item)
}

const countActiveDays = (sessions: ProgressSessionRecord[]) =>
  new Set(sessions.map((session) => getLocalDateKey(new Date(session.completedAt))))
    .size

const isWithinPeriod = (date: Date, startDate: Date, endDate: Date) =>
  date >= startDate && date <= endDate

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)

const endOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

const startOfWeek = (date: Date) => {
  const start = startOfDay(date)
  const dayOffset = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - dayOffset)
  return start
}

const endOfWeek = (date: Date) => {
  const end = startOfWeek(date)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)

const endOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

const getLocalDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const formatDateRange = (startDate: Date, endDate: Date) => {
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
  })

  if (getLocalDateKey(startDate) === getLocalDateKey(endDate)) {
    return formatter.format(startDate)
  }

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`
}

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
  }).format(date)
