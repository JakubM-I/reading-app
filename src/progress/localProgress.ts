import { getSessionSummary, type ReadingSession } from '../session'
import { getEarnedBadges } from './progressBadges'
import type {
  MaterialProgressRecord,
  ProgressSessionRecord,
  ProgressTaskRecord,
  StoredProgress,
} from './progressTypes'

const STORAGE_KEY = 'reading-app-progress-v1'

export const createEmptyProgress = (): StoredProgress => ({
  version: 1,
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
  const summary = getSessionSummary(session)
  const taskById = new Map(session.tasks.map((task) => [task.id, task]))
  const taskRecords = session.answers.map((answer): ProgressTaskRecord => {
    const task = taskById.get(answer.taskId)

    return {
      taskId: answer.taskId,
      kind: task?.kind ?? 'warmup',
      materialId: task?.materialId ?? answer.taskId,
      reviewText: task?.reviewText ?? task?.displayText ?? answer.taskId,
      rating: answer.rating,
      points: answer.points,
    }
  })
  const sessionRecord: ProgressSessionRecord = {
    id: session.id,
    completedAt,
    levelId: session.levelId,
    totalTasks: summary.totalTasks,
    totalPoints: summary.totalPoints,
    counts: summary.counts,
    difficultTasks: summary.difficultTasks,
    skippedTasks: summary.skippedTasks,
    tasks: taskRecords,
  }
  const totalPoints = progress.totalPoints + summary.totalPoints
  const difficultItems = uniqueRecentItems([
    ...summary.difficultTasks,
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
      taskRecords,
      completedAt,
    ),
  }
}

const normalizeProgress = (value: unknown): StoredProgress => {
  if (!isStoredProgress(value)) {
    return createEmptyProgress()
  }

  return {
    ...createEmptyProgress(),
    ...value,
    version: 1,
    sessions: value.sessions,
    badges: value.badges,
    difficultItems: value.difficultItems,
    materialProgress: value.materialProgress,
  }
}

const isStoredProgress = (value: unknown): value is StoredProgress => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const progress = value as Partial<StoredProgress>

  return (
    progress.version === 1 &&
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

const updateMaterialProgress = (
  currentProgress: StoredProgress['materialProgress'],
  taskRecords: ProgressTaskRecord[],
  practicedAt: string,
) => {
  const nextProgress = { ...currentProgress }

  for (const task of taskRecords) {
    const previousRecord = nextProgress[task.materialId]
    const nextRecord: MaterialProgressRecord = {
      materialId: task.materialId,
      kind: task.kind,
      reviewText: task.reviewText,
      lastRating: task.rating,
      lastPracticedAt: practicedAt,
      attempts: (previousRecord?.attempts ?? 0) + 1,
      hardCount: (previousRecord?.hardCount ?? 0) + (task.rating === 'hard' ? 1 : 0),
      skippedCount:
        (previousRecord?.skippedCount ?? 0) + (task.rating === 'skip' ? 1 : 0),
    }

    nextProgress[task.materialId] = nextRecord
  }

  return nextProgress
}
