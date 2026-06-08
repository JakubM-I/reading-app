import type { ContentWord, ExerciseContent } from '../content/contentTypes'
import type { MaterialProgressRecord } from '../progress/progressTypes'
import type {
  ReadingSession,
  SessionTask,
  SessionTaskKind,
  SyllabificationSupportMode,
} from './sessionTypes'

const SESSION_TASK_SEQUENCE: SessionTaskKind[] = [
  'syllable-count',
  'syllable-say',
  'syllable-say',
  'syllable-build',
  'syllable-split',
  'syllable-split',
]

interface CreateSyllabificationSessionOptions {
  materialProgress?: Record<string, MaterialProgressRecord>
  sessionIndex?: number
}

export const createSyllabificationSession = (
  levelId: string,
  supportMode: SyllabificationSupportMode,
  content: ExerciseContent,
  options: CreateSyllabificationSessionOptions = {},
): ReadingSession => {
  const levelOrder = content.levels.find((level) => level.id === levelId)?.order ?? 1
  const levelOrderById = new Map(content.levels.map((level) => [level.id, level.order]))
  const materialProgress = options.materialProgress ?? {}
  const sessionIndex = options.sessionIndex ?? 0
  const isAvailable = (itemLevelId: string) =>
    (levelOrderById.get(itemLevelId) ?? 0) <= levelOrder

  const words = sortByMaterialPriority(
    prioritizeLevel(
      content.words.filter(
        (word) =>
          isAvailable(word.levelId) &&
          word.suitableForSyllabification &&
          word.syllableCount >= 2,
      ),
      levelId,
    ),
    levelId,
    materialProgress,
    sessionIndex,
  )

  const selectedWords = takeLooped(words, SESSION_TASK_SEQUENCE.length)
  const tasks = SESSION_TASK_SEQUENCE.map((kind, index): SessionTask => {
    const word = selectedWords[index]

    if (!word) {
      return createFallbackTask(kind, index, supportMode)
    }

    return createSyllabificationTask(kind, word, index, supportMode)
  })

  return {
    id: `syllabification-session-${levelId}-${Date.now()}`,
    module: 'syllabification',
    levelId,
    tasks,
    currentTaskIndex: 0,
    answers: [],
    status: 'active',
  }
}

const createSyllabificationTask = (
  kind: SessionTaskKind,
  word: ContentWord,
  index: number,
  supportMode: SyllabificationSupportMode,
): SessionTask => ({
  id: `${kind}-${index + 1}-${word.id}`,
  module: 'syllabification',
  kind,
  title: getTaskTitle(kind),
  prompt: getTaskPrompt(kind, supportMode),
  displayText: getDisplayText(word, supportMode),
  supportText: getSupportText(word, kind, supportMode),
  materialId: word.id,
  reviewText: word.text,
  syllabification: {
    word: word.text,
    syllables: word.syllables,
    syllableCount: word.syllableCount,
    supportMode,
    revealedSplit: getRevealedSplit(word, supportMode),
  },
})

const createFallbackTask = (
  kind: SessionTaskKind,
  index: number,
  supportMode: SyllabificationSupportMode,
): SessionTask => ({
  id: `${kind}-${index + 1}-empty`,
  module: 'syllabification',
  kind,
  title: getTaskTitle(kind),
  prompt: 'Brakuje słów do tego poziomu.',
  displayText: 'Brak zadania',
  supportText: 'Wróć do wyboru poziomu.',
  materialId: `missing-syllabification-word-${index + 1}`,
  reviewText: 'Brak zadania',
  syllabification: {
    word: '',
    syllables: [],
    syllableCount: 0,
    supportMode,
  },
})

const getTaskTitle = (kind: SessionTaskKind) => {
  if (kind === 'syllable-count') {
    return 'Policz sylaby'
  }

  if (kind === 'syllable-say') {
    return 'Powiedz sylabami'
  }

  if (kind === 'syllable-build') {
    return 'Ułóż sylaby'
  }

  return 'Wstaw podział'
}

const getTaskPrompt = (
  kind: SessionTaskKind,
  supportMode: SyllabificationSupportMode,
) => {
  if (kind === 'syllable-count') {
    return 'Policz części słowa.'
  }

  if (kind === 'syllable-say') {
    return supportMode === 'full-help'
      ? 'Przeczytaj części po kolei.'
      : 'Powiedz słowo sylabami.'
  }

  if (kind === 'syllable-build') {
    return 'Ułóż części słowa w kolejności.'
  }

  return supportMode === 'independent'
    ? 'Wskaż miejsca podziału.'
    : 'Uzupełnij podział słowa.'
}

const getDisplayText = (
  word: ContentWord,
  supportMode: SyllabificationSupportMode,
) => {
  if (supportMode === 'full-help') {
    return word.syllables.join(' - ')
  }

  return word.text
}

const getSupportText = (
  word: ContentWord,
  kind: SessionTaskKind,
  supportMode: SyllabificationSupportMode,
) => {
  if (supportMode === 'full-help') {
    return `Całe słowo: ${word.text}`
  }

  if (supportMode === 'partial-help' || kind === 'syllable-count') {
    return `${word.syllableCount} sylaby`
  }

  return undefined
}

const getRevealedSplit = (
  word: ContentWord,
  supportMode: SyllabificationSupportMode,
) => {
  if (supportMode === 'full-help') {
    return word.syllables
  }

  if (supportMode === 'partial-help') {
    return [word.syllables[0], ...word.syllables.slice(1).map(() => '')]
  }

  return undefined
}

const prioritizeLevel = <Item extends { levelId: string }>(
  items: readonly Item[],
  levelId: string,
) => [
  ...items.filter((item) => item.levelId === levelId),
  ...items.filter((item) => item.levelId !== levelId),
]

const sortByMaterialPriority = <Item extends { id: string; levelId: string }>(
  items: readonly Item[],
  levelId: string,
  progress: Record<string, MaterialProgressRecord>,
  sessionIndex: number,
) =>
  [...items].sort((firstItem, secondItem) =>
    comparePriority(
      getMaterialPriority(firstItem, levelId, progress, sessionIndex),
      getMaterialPriority(secondItem, levelId, progress, sessionIndex),
    ),
  )

const getMaterialPriority = <Item extends { id: string; levelId: string }>(
  item: Item,
  levelId: string,
  progress: Record<string, MaterialProgressRecord>,
  sessionIndex: number,
) => {
  const record = progress[`syllabification:${item.id}`]
  const levelPriority = item.levelId === levelId ? 0 : 1

  if (!record) {
    return [10, levelPriority, stableRotation(item.id, sessionIndex)]
  }

  const lastPracticedAt = Date.parse(record.lastPracticedAt) || 0

  if (record.lastRating === 'hard') {
    return [0, levelPriority, -record.hardCount, lastPracticedAt]
  }

  if (record.lastRating === 'with-help') {
    return [1, levelPriority, record.attempts, lastPracticedAt]
  }

  if (record.lastRating === 'skip') {
    return [2, levelPriority, record.attempts, lastPracticedAt]
  }

  return [20, levelPriority, lastPracticedAt, record.attempts]
}

const comparePriority = (firstPriority: number[], secondPriority: number[]) => {
  const length = Math.max(firstPriority.length, secondPriority.length)

  for (let index = 0; index < length; index += 1) {
    const difference = (firstPriority[index] ?? 0) - (secondPriority[index] ?? 0)

    if (difference !== 0) {
      return difference
    }
  }

  return 0
}

const stableRotation = (value: string, sessionIndex: number) => {
  let hash = sessionIndex + 1

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973
  }

  return hash
}

const takeLooped = <Item,>(items: readonly Item[], count: number): Item[] => {
  if (items.length === 0) {
    return []
  }

  return Array.from({ length: count }, (_, index) => items[index % items.length])
}
