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
  'syllable-read': [1, 1, 1, 1],
  'syllable-count': [1, 1, 1, 1],
  'syllable-say': [1, 1, 1, 1],
  'syllable-build': [1, 1, 1, 1],
  'syllable-split': [1, 1, 1, 1],
  'blend-read': [1, 1, 1, 1],
  'structure-read': [1, 1, 1, 1],
  'structure-build': [1, 1, 1, 1],
  'structure-review': [1, 1, 1, 1],
}

const syllabificationTaskPoints: Record<SyllabificationSupportMode, number[]> = {
  'full-help': [1, 1, 2, 2],
  'partial-help': [2, 2, 3, 4],
  independent: [2, 3, 4, 5],
}

export const getTaskRatingPoints = (
  task: SessionTask,
  rating: SessionRating,
) => {
  if (rating === 'skip') {
    return 0
  }

  if (rating === 'hard') {
    return 1
  }

  const basePoints = getTaskBasePoints(task)

  if (rating === 'with-help') {
    return Math.max(1, basePoints - 1)
  }

  return basePoints
}

const getTaskBasePoints = (task: SessionTask) => {
  const levelIndex = Math.min(Math.max(task.difficultyOrder, 1), 4) - 1

  if (task.module === 'syllabification') {
    if (task.kind === 'syllable-read') {
      return 1
    }

    const supportMode =
      task.structureExercise?.supportMode ??
      task.syllabification?.supportMode ??
      'full-help'

    return syllabificationTaskPoints[supportMode][levelIndex]
  }

  return readingTaskPoints[task.kind][levelIndex]
}
