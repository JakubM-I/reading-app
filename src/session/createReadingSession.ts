import type {
  ContentSentence,
  ContentWord,
  ExerciseContent,
  SyllableKind,
} from '../content/contentTypes'
import type { MaterialProgressRecord } from '../progress/progressTypes'
import type { ReadingSession, SessionTask } from './sessionTypes'

const SESSION_TASK_COUNT = {
  warmup: 3,
  guidedReading: 4,
  wordBuilding: 2,
  sentence: 1,
}

interface CreateReadingSessionOptions {
  materialProgress?: Record<string, MaterialProgressRecord>
  sessionIndex?: number
}

export const createReadingSession = (
  levelId: string,
  content: ExerciseContent,
  options: CreateReadingSessionOptions = {},
): ReadingSession => {
  const levelOrder = content.levels.find((level) => level.id === levelId)?.order ?? 1
  const levelOrderById = new Map(content.levels.map((level) => [level.id, level.order]))
  const materialProgress = options.materialProgress ?? {}
  const sessionIndex = options.sessionIndex ?? 0
  const isAvailable = (itemLevelId: string) =>
    (levelOrderById.get(itemLevelId) ?? 0) <= levelOrder

  const syllables = sortByMaterialPriority(
    prioritizeLevel(
      content.syllables.filter((syllable) => isAvailable(syllable.levelId)),
      levelId,
    ),
    levelId,
    materialProgress,
    sessionIndex,
  )
  const words = sortByMaterialPriority(
    prioritizeLevel(
      content.words.filter((word) => isAvailable(word.levelId)),
      levelId,
    ),
    levelId,
    materialProgress,
    sessionIndex + 17,
  )
  const wordsWithSyllableSplit = words.filter((word) => word.syllables.length > 1)
  const sentences = sortByMaterialPriority(
    prioritizeLevel(
      content.sentences.filter((sentence) => isAvailable(sentence.levelId)),
      levelId,
    ),
    levelId,
    materialProgress,
    sessionIndex + 31,
  )
  const guidedReadingWords = wordsWithSyllableSplit.filter((word) =>
    findSentenceForWord(word, sentences),
  )
  const guidedReadingSelection = takeLooped(
    guidedReadingWords.length > 0 ? guidedReadingWords : wordsWithSyllableSplit,
    SESSION_TASK_COUNT.guidedReading,
  )
  const guidedReadingWordIds = new Set(guidedReadingSelection.map((word) => word.id))
  const wordBuildingWords = prioritizeDistinctSyllableWords([
    ...wordsWithSyllableSplit.filter((word) => !guidedReadingWordIds.has(word.id)),
    ...wordsWithSyllableSplit.filter((word) => guidedReadingWordIds.has(word.id)),
  ])

  const warmupTasks = takeLooped(syllables, SESSION_TASK_COUNT.warmup).map(
    (syllable, index): SessionTask => ({
      id: `warmup-${index + 1}-${syllable.id}`,
      module: 'reading',
      kind: 'warmup',
      title: 'Rozgrzewka',
      prompt: 'Przeczytaj na głos.',
      displayText: syllable.text,
      supportText: getWarmupMaterialLabel(syllable.kind),
      materialId: syllable.id,
      reviewText: syllable.text,
    }),
  )

  const guidedReadingTasks = guidedReadingSelection.map((word, index): SessionTask => {
    const sentence = findSentenceForWord(word, sentences)

    return {
      id: `guided-${index + 1}-${word.id}`,
      module: 'reading',
      kind: 'guided-reading',
      title: 'Czytanie prowadzone',
      prompt: 'Czytaj po kolei.',
      displayText: word.syllables.join(' - '),
      supportText: word.text,
      materialId: word.id,
      reviewText: word.text,
      guidedReading: sentence
        ? {
            syllables: word.syllables,
            word: word.text,
            sentence: sentence.text,
            question: sentence.question,
          }
        : undefined,
    }
  })

  const wordBuildingTasks = takeLooped(
    wordBuildingWords,
    SESSION_TASK_COUNT.wordBuilding,
  ).map(
    (word, index): SessionTask => ({
      id: `build-${index + 1}-${word.id}`,
      module: 'reading',
      kind: 'word-building',
      title: 'Budowanie słowa',
      prompt: 'Ułóż słowo z części.',
      displayText: word.text,
      supportText: word.text,
      materialId: word.id,
      reviewText: word.text,
      wordBuilding: {
        targetWord: word.text,
        syllables: word.syllables,
        tiles: buildWordTiles(word.syllables),
      },
    }),
  )

  const sentenceTasks = takeLooped(sentences, SESSION_TASK_COUNT.sentence).map(
    (sentence, index): SessionTask => ({
      id: `sentence-${index + 1}-${sentence.id}`,
      module: 'reading',
      kind: 'sentence-comprehension',
      title: 'Zdanie i pytanie',
      prompt: 'Przeczytaj zdanie i odpowiedz ustnie.',
      displayText: sentence.text,
      supportText: sentence.question,
      materialId: sentence.id,
      reviewText: sentence.text,
    }),
  )

  return {
    id: `session-${levelId}-${Date.now()}`,
    module: 'reading',
    levelId,
    tasks: [
      ...warmupTasks,
      ...guidedReadingTasks,
      ...wordBuildingTasks,
      ...sentenceTasks,
    ],
    currentTaskIndex: 0,
    answers: [],
    status: 'active',
  }
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
  const record = progress[item.id]
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

const findSentenceForWord = (
  word: ContentWord,
  sentences: readonly ContentSentence[],
) => sentences.find((sentence) => sentence.relatedWordIds.includes(word.id))

const buildWordTiles = (syllables: string[]) => {
  const tiles = syllables.map((text, index) => ({
    id: `tile-${index + 1}`,
    text,
  }))

  if (tiles.length < 2) {
    return tiles
  }

  return [...tiles.slice(1), tiles[0]]
}

const getWarmupMaterialLabel = (kind: SyllableKind) => {
  if (kind === 'digraph') {
    return 'Dwuznak'
  }

  if (kind === 'trigraph') {
    return 'Trójznak'
  }

  return 'Sylaba'
}
