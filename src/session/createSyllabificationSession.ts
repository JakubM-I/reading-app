import type {
  ContentSyllable,
  ContentWord,
  ExerciseContent,
} from '../content/contentTypes'
import type { MaterialProgressRecord } from '../progress/progressTypes'
import type {
  ReadingSession,
  SessionTask,
  SessionTaskKind,
  SyllabificationSupportMode,
} from './sessionTypes'

const SESSION_TASK_SEQUENCE: SessionTaskKind[] = [
  'syllable-read',
  'syllable-read',
  'syllable-read',
  'syllable-read',
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
  const syllables = sortByMaterialPriority(
    prioritizeLevel(
      content.syllables.filter(
        (syllable) =>
          isAvailable(syllable.levelId) && syllable.kind === 'syllable',
      ),
      levelId,
    ),
    levelId,
    materialProgress,
    sessionIndex + 23,
  )

  const selectedSyllables = takeLooped(
    syllables,
    SESSION_TASK_SEQUENCE.filter((kind) => kind === 'syllable-read').length,
  )
  const wordTaskSequence = SESSION_TASK_SEQUENCE.filter(
    (kind) => kind !== 'syllable-read',
  )
  const selectedWords = takeLooped(words, wordTaskSequence.length)
  const buildWords = prioritizeDistinctSyllableWords(words)
  let syllableIndex = 0
  let wordIndex = 0
  const tasks = SESSION_TASK_SEQUENCE.map((kind, index): SessionTask => {
    if (kind === 'syllable-read') {
      const syllable = selectedSyllables[syllableIndex]
      syllableIndex += 1

      if (!syllable) {
        return createSyllableFallbackTask(index)
      }

      return createSyllableReadTask(syllable, index)
    }

    const word =
      kind === 'syllable-build'
        ? takeLooped(buildWords, 1)[0]
        : selectedWords[wordIndex]
    wordIndex += 1

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

const createSyllableReadTask = (
  syllable: ContentSyllable,
  index: number,
): SessionTask => ({
  id: `syllable-read-${index + 1}-${syllable.id}`,
  module: 'syllabification',
  kind: 'syllable-read',
  title: 'Sylaba',
  prompt: 'Przeczytaj sylabę.',
  displayText: syllable.text,
  materialId: syllable.id,
  reviewText: syllable.text,
})

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
  supportText: getSupportText(word, supportMode),
  materialId: word.id,
  reviewText: word.text,
  syllabification: {
    word: word.text,
    syllables: word.syllables,
    tiles: buildSyllableTiles(word.syllables),
    syllableCount: word.syllableCount,
    supportMode,
    revealedSplit: getRevealedSplit(word, supportMode),
  },
})

const createSyllableFallbackTask = (index: number): SessionTask => ({
  id: `syllable-read-${index + 1}-empty`,
  module: 'syllabification',
  kind: 'syllable-read',
  title: 'Sylaba',
  prompt: 'Brakuje sylab do tego poziomu.',
  displayText: 'Brak zadania',
  supportText: 'Wróć do wyboru poziomu.',
  materialId: `missing-syllabification-syllable-${index + 1}`,
  reviewText: 'Brak zadania',
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
    tiles: [],
    syllableCount: 0,
    supportMode,
  },
})

const getTaskTitle = (kind: SessionTaskKind) => {
  if (kind === 'syllable-read') {
    return 'Sylaba'
  }

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
  if (kind === 'syllable-read') {
    return 'Przeczytaj sylabę.'
  }

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
  supportMode: SyllabificationSupportMode,
) => {
  if (supportMode === 'full-help') {
    return `Całe słowo: ${word.text}`
  }

  if (supportMode === 'partial-help') {
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

const prioritizeDistinctSyllableWords = (words: readonly ContentWord[]) => [
  ...words.filter(hasDistinctSyllables),
  ...words.filter((word) => !hasDistinctSyllables(word)),
]

const hasDistinctSyllables = (word: ContentWord) =>
  new Set(word.syllables).size > 1

const buildSyllableTiles = (syllables: string[]) => {
  const tiles = syllables.map((text, index) => ({
    id: `tile-${index + 1}`,
    text,
  }))

  if (tiles.length < 2) {
    return tiles
  }

  return [...tiles.slice(1), tiles[0]]
}
