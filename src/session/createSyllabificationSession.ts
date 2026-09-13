import type {
  ContentBlend,
  ContentDecodingItem,
  DifficultyStage,
  ExerciseContent,
  StructureId,
} from '../content/contentTypes'
import type { MaterialProgressRecord } from '../progress/progressTypes'
import type {
  ReadingSession,
  SessionTask,
  SessionTaskKind,
  SyllabificationSupportMode,
  WordBuildingTile,
} from './sessionTypes'

const STAGES: DifficultyStage[] = ['basic', 'extended', 'digraph']

interface CreateSyllabificationSessionOptions {
  materialProgress?: Record<string, MaterialProgressRecord>
  sessionIndex?: number
}

export const createSyllabificationSession = (
  structureId: StructureId,
  supportMode: SyllabificationSupportMode,
  includePseudowords: boolean,
  content: ExerciseContent,
  options: CreateSyllabificationSessionOptions = {},
): ReadingSession => {
  const materialProgress = options.materialProgress ?? {}
  const sessionIndex = options.sessionIndex ?? 0
  const difficultyStage = getActiveDifficultyStage(
    structureId,
    content.decodingWords,
    materialProgress,
  )
  const eligibleStages = STAGES.slice(0, STAGES.indexOf(difficultyStage) + 1)
  const wordCount = includePseudowords ? 3 : 5
  const words = selectItems(
    content.decodingWords.filter(
      (item) =>
        item.structureId === structureId &&
        eligibleStages.includes(item.difficultyStage),
    ),
    'structure-read',
    materialProgress,
    difficultyStage,
    sessionIndex,
    wordCount,
  )
  const pseudowords = includePseudowords
    ? selectItems(
        content.pseudowords.filter(
          (item) =>
            item.structureId === structureId &&
            item.difficultyStage === difficultyStage,
        ),
        'structure-read',
        materialProgress,
        difficultyStage,
        sessionIndex + 17,
        2,
      )
    : []
  const blends = selectBlends(
    structureId,
    difficultyStage,
    content.blends,
    materialProgress,
    sessionIndex,
  )
  const readingItems = includePseudowords
    ? [...words.slice(0, 3), ...pseudowords]
    : words.slice(0, 5)
  const buildItem = words[0]
  const reviewItem = words[1] ?? words[0]
  const tasks = [
    ...blends.map((blend, index) =>
      createBlendTask(blend, structureId, supportMode, index),
    ),
    ...readingItems.map((item, index) =>
      createReadTask(item, supportMode, index),
    ),
    createBuildTask(buildItem, structureId, supportMode),
    createReviewTask(reviewItem, supportMode),
  ]

  return {
    id: `syllabification-session-${structureId}-${Date.now()}`,
    module: 'syllabification',
    structureId,
    supportMode,
    includePseudowords,
    difficultyStage,
    tasks,
    currentTaskIndex: 0,
    answers: [],
    status: 'active',
  }
}

export const getActiveDifficultyStage = (
  structureId: StructureId,
  words: readonly ContentDecodingItem[],
  materialProgress: Record<string, MaterialProgressRecord>,
): DifficultyStage => {
  for (const stage of STAGES) {
    const stageWords = words.filter(
      (item) =>
        item.structureId === structureId && item.difficultyStage === stage,
    )
    const everyWordWasRead =
      stageWords.length > 0 &&
      stageWords.every(
        (item) =>
          materialProgress[materialProgressKey('structure-read', item.id)]
            ?.attempts,
      )

    if (!everyWordWasRead) {
      return stage
    }
  }

  return 'digraph'
}

const selectBlends = (
  structureId: StructureId,
  stage: DifficultyStage,
  blends: readonly ContentBlend[],
  progress: Record<string, MaterialProgressRecord>,
  sessionIndex: number,
) => {
  const eligible = blends.filter(
    (blend) =>
      blend.structureIds.includes(structureId) &&
      blend.difficultyStage === stage,
  )
  const cvCount = structureId === 'structure-1' || structureId === 'structure-2'
    ? 3
    : 2
  const cvBlends = selectItems(
    eligible.filter((blend) => blend.blendKind === 'cv'),
    'blend-read',
    progress,
    stage,
    sessionIndex + 31,
    cvCount,
  )

  if (cvCount === 3) {
    return cvBlends
  }

  const cvcBlend = selectItems(
    blends.filter(
      (blend) =>
        blend.structureIds.includes(structureId) &&
        blend.blendKind === 'cvc' &&
        blend.difficultyStage === stage,
    ),
    'blend-read',
    progress,
    stage,
    sessionIndex + 47,
    1,
  )

  return [...cvBlends, ...cvcBlend]
}

const selectItems = <Item extends { id: string; difficultyStage: DifficultyStage }>(
  items: readonly Item[],
  kind: SessionTaskKind,
  progress: Record<string, MaterialProgressRecord>,
  activeStage: DifficultyStage,
  sessionIndex: number,
  count: number,
) =>
  [...items]
    .sort((first, second) =>
      comparePriority(
        getPriority(first, kind, progress, activeStage, sessionIndex),
        getPriority(second, kind, progress, activeStage, sessionIndex),
      ),
    )
    .slice(0, count)

const getPriority = (
  item: { id: string; difficultyStage: DifficultyStage },
  kind: SessionTaskKind,
  progress: Record<string, MaterialProgressRecord>,
  activeStage: DifficultyStage,
  sessionIndex: number,
) => {
  const record = progress[materialProgressKey(kind, item.id)]
  const stagePriority = item.difficultyStage === activeStage ? 0 : 1

  if (!record) {
    return [3, stagePriority, stableRotation(item.id, sessionIndex)]
  }

  const practicedAt = Date.parse(record.lastPracticedAt) || 0

  if (record.lastRating === 'hard') {
    return [0, stagePriority, -record.hardCount, practicedAt]
  }

  if (record.lastRating === 'with-help') {
    return [1, stagePriority, record.attempts, practicedAt]
  }

  if (record.lastRating === 'skip') {
    return [2, stagePriority, record.attempts, practicedAt]
  }

  return [10, stagePriority, practicedAt, record.attempts]
}

const createBlendTask = (
  blend: ContentBlend,
  structureId: StructureId,
  supportMode: SyllabificationSupportMode,
  index: number,
): SessionTask => ({
  id: `blend-${index + 1}-${blend.id}`,
  module: 'syllabification',
  kind: 'blend-read',
  title: 'Połącz i przeczytaj',
  prompt: 'Połącz części i przeczytaj.',
  displayText: `${blend.left} + ${blend.right}`,
  supportText: supportMode === 'full-help' ? blend.result : undefined,
  materialId: blend.id,
  reviewText: blend.result,
  difficultyOrder: getStageOrder(blend.difficultyStage),
  structureId,
  difficultyStage: blend.difficultyStage,
  materialKind: 'blend',
  structureExercise: {
    structureId,
    difficultyStage: blend.difficultyStage,
    materialKind: 'blend',
    text: blend.result,
    syllables: [blend.result],
    graphemes: blend.graphemes,
    supportMode,
    blend: {
      left: blend.left,
      right: blend.right,
      result: blend.result,
    },
  },
})

const createReadTask = (
  item: ContentDecodingItem,
  supportMode: SyllabificationSupportMode,
  index: number,
): SessionTask => ({
  id: `structure-read-${index + 1}-${item.id}`,
  module: 'syllabification',
  kind: 'structure-read',
  title: item.materialKind === 'pseudoword' ? 'Wymyślone słowo' : 'Przeczytaj słowo',
  prompt:
    item.materialKind === 'pseudoword'
      ? 'Przeczytaj wymyślone słowo.'
      : 'Przeczytaj słowo.',
  displayText: item.text,
  supportText:
    item.materialKind === 'pseudoword'
      ? 'Wymyślone słowo — nie musi nic znaczyć.'
      : undefined,
  materialId: item.id,
  reviewText:
    item.materialKind === 'pseudoword'
      ? `${item.text} (wymyślone słowo)`
      : item.text,
  difficultyOrder: getStageOrder(item.difficultyStage),
  structureId: item.structureId,
  difficultyStage: item.difficultyStage,
  materialKind: item.materialKind,
  structureExercise: {
    structureId: item.structureId,
    difficultyStage: item.difficultyStage,
    materialKind: item.materialKind,
    text: item.text,
    syllables: item.syllables,
    graphemes: item.graphemes,
    supportMode,
  },
})

const createBuildTask = (
  item: ContentDecodingItem,
  structureId: StructureId,
  supportMode: SyllabificationSupportMode,
): SessionTask => {
  const parts = structureId === 'structure-3'
    ? item.graphemes.map(([text]) => text)
    : item.syllables

  return {
    id: `structure-build-${item.id}`,
    module: 'syllabification',
    kind: 'structure-build',
    title: 'Ułóż słowo',
    prompt: 'Ułóż części w dobrej kolejności.',
    displayText: '',
    materialId: item.id,
    reviewText: item.text,
    difficultyOrder: getStageOrder(item.difficultyStage),
    structureId,
    difficultyStage: item.difficultyStage,
    materialKind: 'word',
    structureExercise: {
      structureId,
      difficultyStage: item.difficultyStage,
      materialKind: 'word',
      text: item.text,
      syllables: item.syllables,
      graphemes: item.graphemes,
      supportMode,
      tiles: buildTiles(parts),
    },
  }
}

const createReviewTask = (
  item: ContentDecodingItem,
  supportMode: SyllabificationSupportMode,
): SessionTask => ({
  id: `structure-review-${item.id}`,
  module: 'syllabification',
  kind: 'structure-review',
  title: 'Zobacz budowę',
  prompt: 'Zobacz budowę i przeczytaj jeszcze raz.',
  displayText: item.text,
  materialId: item.id,
  reviewText: item.text,
  difficultyOrder: getStageOrder(item.difficultyStage),
  structureId: item.structureId,
  difficultyStage: item.difficultyStage,
  materialKind: 'word',
  structureExercise: {
    structureId: item.structureId,
    difficultyStage: item.difficultyStage,
    materialKind: 'word',
    text: item.text,
    syllables: item.syllables,
    graphemes: item.graphemes,
    supportMode,
  },
})

const buildTiles = (parts: string[]): WordBuildingTile[] => {
  const tiles = parts.map((text, index) => ({
    id: `tile-${index + 1}`,
    text,
  }))

  if (tiles.length < 2) {
    return tiles
  }

  return [...tiles.slice(1), tiles[0]]
}

const getStageOrder = (stage: DifficultyStage) => STAGES.indexOf(stage) + 1

const materialProgressKey = (kind: SessionTaskKind, materialId: string) =>
  `syllabification:${kind}:${materialId}`

const comparePriority = (first: number[], second: number[]) => {
  const length = Math.max(first.length, second.length)

  for (let index = 0; index < length; index += 1) {
    const difference = (first[index] ?? 0) - (second[index] ?? 0)
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
