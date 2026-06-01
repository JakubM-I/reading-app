import type { ExerciseContent } from '../content/contentTypes'
import type { ReadingSession, SessionTask } from './sessionTypes'

const SESSION_TASK_COUNT = {
  warmup: 3,
  guidedReading: 4,
  wordBuilding: 2,
  sentence: 1,
}

export const createReadingSession = (
  levelId: string,
  content: ExerciseContent,
): ReadingSession => {
  const levelOrder = content.levels.find((level) => level.id === levelId)?.order ?? 1
  const levelOrderById = new Map(content.levels.map((level) => [level.id, level.order]))
  const isAvailable = (itemLevelId: string) =>
    (levelOrderById.get(itemLevelId) ?? 0) <= levelOrder

  const syllables = prioritizeLevel(
    content.syllables.filter((syllable) => isAvailable(syllable.levelId)),
    levelId,
  )
  const words = prioritizeLevel(
    content.words.filter((word) => isAvailable(word.levelId)),
    levelId,
  )
  const wordsWithSyllableSplit = words.filter((word) => word.syllables.length > 1)
  const sentences = prioritizeLevel(
    content.sentences.filter((sentence) => isAvailable(sentence.levelId)),
    levelId,
  )

  const warmupTasks = takeLooped(syllables, SESSION_TASK_COUNT.warmup).map(
    (syllable, index): SessionTask => ({
      id: `warmup-${index + 1}-${syllable.id}`,
      kind: 'warmup',
      title: 'Rozgrzewka',
      prompt: 'Przeczytaj spokojnie.',
      displayText: syllable.text,
      supportText: syllable.kind === 'digraph' ? 'Dwuznak' : 'Sylaba',
      materialId: syllable.id,
      reviewText: syllable.text,
    }),
  )

  const guidedReadingTasks = takeLooped(
    wordsWithSyllableSplit,
    SESSION_TASK_COUNT.guidedReading,
  ).map((word, index): SessionTask => ({
      id: `guided-${index + 1}-${word.id}`,
      kind: 'guided-reading',
      title: 'Czytanie prowadzone',
      prompt: 'Najpierw sylaby, potem cały wyraz.',
      displayText: word.syllables.join(' - '),
      supportText: word.text,
      materialId: word.id,
      reviewText: word.text,
    }))

  const wordBuildingTasks = takeLooped(
    wordsWithSyllableSplit,
    SESSION_TASK_COUNT.wordBuilding,
  ).map(
    (word, index): SessionTask => ({
      id: `build-${index + 1}-${word.id}`,
      kind: 'word-building',
      title: 'Budowanie słowa',
      prompt: 'Ułóż słowo z części.',
      displayText: word.syllables.join('  +  '),
      supportText: word.text,
      materialId: word.id,
      reviewText: word.text,
    }),
  )

  const sentenceTasks = takeLooped(sentences, SESSION_TASK_COUNT.sentence).map(
    (sentence, index): SessionTask => ({
      id: `sentence-${index + 1}-${sentence.id}`,
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

const takeLooped = <Item,>(items: readonly Item[], count: number): Item[] => {
  if (items.length === 0) {
    return []
  }

  return Array.from({ length: count }, (_, index) => items[index % items.length])
}
