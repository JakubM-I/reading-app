import {
  getSessionSummary,
  type ReadingSession,
  type SessionModule,
} from '../session'
import { getEarnedBadges } from './progressBadges'
import type {
  MaterialProgressRecord,
  ProgressSessionAttempt,
  ProgressSessionRecord,
  ProgressTaskRecord,
  StoredProgress,
} from './progressTypes'

const STORAGE_KEY = 'reading-app-progress-v1'
let attemptSequence = 0
const materialProgressKey = (
  module: SessionModule,
  kind: ProgressTaskRecord['kind'],
  materialId: string,
) => `${module}:${kind}:${materialId}`

export const createEmptyProgress = (): StoredProgress => ({
  version: 3,
  totalPoints: 0,
  sessions: [],
  badges: [],
  difficultItems: [],
  materialProgress: {},
})

export const loadProgress = (): StoredProgress => {
  if (typeof window === 'undefined') {
    return createEmptyProgress()
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return createEmptyProgress()
  }

  try {
    return normalizeProgress(JSON.parse(rawValue))
  } catch {
    return createEmptyProgress()
  }
}

export const saveProgress = (progress: StoredProgress) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export const clearProgress = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export const recordCompletedSession = (
  progress: StoredProgress,
  session: ReadingSession,
): StoredProgress => {
  const completedAt = new Date().toISOString()
  const attempt = createAttempt(session, completedAt)
  const sessionRecord: ProgressSessionRecord = {
    id: session.id,
    completedAt,
    module: session.module,
    levelId: session.module === 'reading' ? session.levelId : undefined,
    structureId:
      session.module === 'syllabification' ? session.structureId : undefined,
    supportMode:
      session.module === 'syllabification' ? session.supportMode : undefined,
    includePseudowords:
      session.module === 'syllabification'
        ? session.includePseudowords
        : undefined,
    totalTasks: attempt.totalTasks,
    totalPoints: attempt.totalPoints,
    counts: attempt.counts,
    difficultTasks: attempt.difficultTasks,
    skippedTasks: attempt.skippedTasks,
    tasks: attempt.tasks,
    sessionTasks: session.tasks,
    attempts: [attempt],
    bestAttemptId: attempt.id,
  }
  const totalPoints = progress.totalPoints + attempt.totalPoints
  const difficultItems = uniqueRecentItems([
    ...attempt.difficultTasks,
    ...progress.difficultItems,
  ])

  return {
    ...progress,
    totalPoints,
    sessions: [...progress.sessions, sessionRecord],
    badges: getEarnedBadges(totalPoints, progress.badges, completedAt),
    difficultItems,
    materialProgress: updateMaterialProgress(
      progress.materialProgress,
      attempt.tasks,
      completedAt,
    ),
  }
}

export const recordRepeatedSession = (
  progress: StoredProgress,
  sessionId: string,
  session: ReadingSession,
): StoredProgress => {
  const recordIndex = progress.sessions.findIndex((item) => item.id === sessionId)

  if (recordIndex < 0) {
    return progress
  }

  const completedAt = new Date().toISOString()
  const attempt = createAttempt(session, completedAt)
  const currentRecord = progress.sessions[recordIndex]
  const currentBest = getBestSessionAttempt(currentRecord)
  const nextBest = attempt.totalPoints > currentBest.totalPoints ? attempt : currentBest
  const nextRecord: ProgressSessionRecord = {
    ...currentRecord,
    totalTasks: nextBest.totalTasks,
    totalPoints: nextBest.totalPoints,
    counts: nextBest.counts,
    difficultTasks: nextBest.difficultTasks,
    skippedTasks: nextBest.skippedTasks,
    tasks: nextBest.tasks,
    attempts: [...currentRecord.attempts, attempt],
    bestAttemptId: nextBest.id,
  }
  const sessions = [...progress.sessions]
  sessions[recordIndex] = nextRecord
  const totalPoints = progress.totalPoints + Math.max(0, attempt.totalPoints - currentBest.totalPoints)

  return {
    ...progress,
    totalPoints,
    sessions,
    badges: getEarnedBadges(totalPoints, progress.badges, completedAt),
    difficultItems: getRecentDifficultItems(sessions),
    materialProgress: updateMaterialProgress(
      progress.materialProgress,
      attempt.tasks,
      completedAt,
    ),
  }
}

export const getBestSessionAttempt = (
  session: ProgressSessionRecord,
): ProgressSessionAttempt =>
  session.attempts.find((attempt) => attempt.id === session.bestAttemptId) ??
  session.attempts[0]

export const canRepeatSession = (session: ProgressSessionRecord) => {
  const bestAttempt = getBestSessionAttempt(session)
  return Boolean(session.sessionTasks) && bestAttempt.counts.independent < bestAttempt.totalTasks
}

const createAttempt = (
  session: ReadingSession,
  completedAt: string,
): ProgressSessionAttempt => {
  const summary = getSessionSummary(session)
  const taskById = new Map(session.tasks.map((task) => [task.id, task]))
  const tasks = session.answers.map((answer): ProgressTaskRecord => {
    const task = taskById.get(answer.taskId)

    return {
      taskId: answer.taskId,
      module: task?.module ?? session.module,
      kind: task?.kind ?? 'warmup',
      materialId: task?.materialId ?? answer.taskId,
      reviewText: task?.reviewText ?? task?.displayText ?? answer.taskId,
      rating: answer.rating,
      points: answer.points,
      structureId: task?.structureId,
      materialKind: task?.materialKind,
    }
  })

  return {
    id: `attempt-${session.id}-${Date.now()}-${attemptSequence++}`,
    completedAt,
    totalTasks: summary.totalTasks,
    totalPoints: summary.totalPoints,
    counts: summary.counts,
    difficultTasks: summary.difficultTasks,
    skippedTasks: summary.skippedTasks,
    tasks,
  }
}

export const normalizeProgress = (value: unknown): StoredProgress => {
  if (!isStoredProgress(value)) {
    return createEmptyProgress()
  }

  const sessions = value.sessions.map(normalizeSessionRecord)
  const materialProgress = normalizeMaterialProgress(value.materialProgress)

  return {
    ...createEmptyProgress(),
    ...value,
    version: 3,
    sessions,
    badges: value.badges,
    difficultItems: value.difficultItems,
    materialProgress,
  }
}

const isStoredProgress = (value: unknown): value is StoredProgress => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const progress = value as {
    version?: number
    totalPoints?: unknown
    sessions?: unknown
    badges?: unknown
    difficultItems?: unknown
    materialProgress?: unknown
  }

  return (
    (progress.version === 1 || progress.version === 2 || progress.version === 3) &&
    typeof progress.totalPoints === 'number' &&
    Array.isArray(progress.sessions) &&
    Array.isArray(progress.badges) &&
    Array.isArray(progress.difficultItems) &&
    Boolean(progress.materialProgress) &&
    typeof progress.materialProgress === 'object'
  )
}

const uniqueRecentItems = (items: string[]) => {
  const uniqueItems: string[] = []

  for (const item of items) {
    if (!uniqueItems.includes(item)) {
      uniqueItems.push(item)
    }
  }

  return uniqueItems.slice(0, 20)
}

const getRecentDifficultItems = (sessions: ProgressSessionRecord[]) =>
  uniqueRecentItems(
    [...sessions]
      .sort((first, second) => Date.parse(second.completedAt) - Date.parse(first.completedAt))
      .flatMap((session) => getBestSessionAttempt(session).difficultTasks),
  )

const updateMaterialProgress = (
  currentProgress: StoredProgress['materialProgress'],
  taskRecords: ProgressTaskRecord[],
  practicedAt: string,
) => {
  const nextProgress = { ...currentProgress }

  for (const task of taskRecords) {
    const key = materialProgressKey(task.module, task.kind, task.materialId)
    const previousRecord = nextProgress[key]
    const nextRecord: MaterialProgressRecord = {
      materialId: task.materialId,
      module: task.module,
      kind: task.kind,
      reviewText: task.reviewText,
      lastRating: task.rating,
      lastPracticedAt: practicedAt,
      attempts: (previousRecord?.attempts ?? 0) + 1,
      hardCount: (previousRecord?.hardCount ?? 0) + (task.rating === 'hard' ? 1 : 0),
      skippedCount:
        (previousRecord?.skippedCount ?? 0) + (task.rating === 'skip' ? 1 : 0),
    }

    nextProgress[key] = nextRecord
  }

  return nextProgress
}

const normalizeSessionRecord = (
  session: ProgressSessionRecord,
): ProgressSessionRecord => {
  const module = normalizeModule(session.module)
  const attempts = Array.isArray(session.attempts) && session.attempts.length > 0
    ? session.attempts.map((attempt) => normalizeAttempt(attempt, module))
    : [createLegacyAttempt(session, module)]
  const bestAttemptId = attempts.some((attempt) => attempt.id === session.bestAttemptId)
    ? session.bestAttemptId
    : attempts[0].id
  const bestAttempt = attempts.find((attempt) => attempt.id === bestAttemptId) ?? attempts[0]

  return {
    ...session,
    module,
    totalTasks: bestAttempt.totalTasks,
    totalPoints: bestAttempt.totalPoints,
    counts: bestAttempt.counts,
    difficultTasks: bestAttempt.difficultTasks,
    skippedTasks: bestAttempt.skippedTasks,
    tasks: bestAttempt.tasks,
    attempts,
    bestAttemptId,
  }
}

const createLegacyAttempt = (
  session: ProgressSessionRecord,
  module: SessionModule,
): ProgressSessionAttempt => ({
  id: `legacy-${session.id}`,
  completedAt: session.completedAt,
  totalTasks: session.totalTasks,
  totalPoints: session.totalPoints,
  counts: session.counts,
  difficultTasks: session.difficultTasks,
  skippedTasks: session.skippedTasks,
  tasks: session.tasks.map((task) => ({
    ...task,
    module: normalizeModule(task.module, module),
  })),
})

const normalizeAttempt = (
  attempt: ProgressSessionAttempt,
  module: SessionModule,
): ProgressSessionAttempt => ({
  ...attempt,
  tasks: attempt.tasks.map((task) => ({
    ...task,
    module: normalizeModule(task.module, module),
  })),
})

const normalizeMaterialProgress = (
  progress: StoredProgress['materialProgress'],
) => {
  const normalizedProgress: StoredProgress['materialProgress'] = {}

  for (const [key, record] of Object.entries(progress)) {
    const module = normalizeModule(record.module, getModuleFromMaterialKey(key))
    const normalizedRecord: MaterialProgressRecord = {
      ...record,
      module,
    }

    normalizedProgress[materialProgressKey(module, record.kind, record.materialId)] =
      normalizedRecord
  }

  return normalizedProgress
}

const normalizeModule = (
  module: SessionModule | undefined,
  fallback: SessionModule = 'reading',
): SessionModule =>
  module === 'syllabification' || module === 'reading' ? module : fallback

const getModuleFromMaterialKey = (key: string): SessionModule => {
  if (key.startsWith('syllabification:')) {
    return 'syllabification'
  }

  return 'reading'
}
