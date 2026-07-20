import type {
  RatingOption,
  SessionRating,
  SessionTask,
  SessionTaskKind,
  SyllabificationSupportMode,
} from './sessionTypes'

export const ratingOptions: RatingOption[] = [
  { value: 'independent', label: 'Samodzielnie' },
  { value: 'with-help', label: 'Z pomocą' },
  { value: 'hard', label: 'Trudne' },
  { value: 'skip', label: 'Pomiń' },
]

export const ratingLabels: Record<SessionRating, string> = {
  independent: 'Samodzielnie',
  'with-help': 'Z pomocą',
  hard: 'Trudne',
  skip: 'Pomiń',
}

const readingTaskPoints: Record<SessionTaskKind, number[]> = {
  warmup: [1, 1, 1, 2],
  'guided-reading': [1, 2, 3, 4],
  'word-building': [2, 2, 4, 5],
  'sentence-comprehension': [2, 3, 5, 7],
  'syllable-count': [1, 1, 1, 1],
  'syllable-say': [1, 1, 1, 1],
  'syllable-build': [1, 1, 1, 1],
  'syllable-split': [1, 1, 1, 1],
}

const syllabificationTaskPoints: Record<SyllabificationSupportMode, number[]> = {
  'full-help': [1, 1, 2, 2],
  'partial-help': [2, 2, 3, 4],
  independent: [2, 3, 4, 5],
}

export const getTaskRatingPoints = (
  task: SessionTask,
  levelId: string,
  rating: SessionRating,
) => {
  if (rating === 'skip') {
    return 0
  }

  if (rating === 'hard') {
    return 1
  }

  const basePoints = getTaskBasePoints(task, levelId)

  if (rating === 'with-help') {
    return Math.max(1, basePoints - 1)
  }

  return basePoints
}

const getTaskBasePoints = (task: SessionTask, levelId: string) => {
  const levelIndex = getLevelIndex(levelId)

  if (task.module === 'syllabification') {
    const supportMode = task.syllabification?.supportMode ?? 'full-help'

    return syllabificationTaskPoints[supportMode][levelIndex]
  }

  return readingTaskPoints[task.kind][levelIndex]
}

const getLevelIndex = (levelId: string) => {
  const match = /^level-(\d+)$/.exec(levelId)
  const levelOrder = match ? Number(match[1]) : 1

  return Math.min(Math.max(levelOrder, 1), 4) - 1
}
