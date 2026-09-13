import type {
  ContentLevel,
  DifficultyStage,
  GraphemeTuple,
  MaterialKind,
  SentenceId,
  StructureId,
  SyllableId,
  WordId,
} from '../content/contentTypes'

export type SessionTaskKind =
  | 'warmup'
  | 'guided-reading'
  | 'word-building'
  | 'sentence-comprehension'
  | 'syllable-read'
  | 'syllable-count'
  | 'syllable-say'
  | 'syllable-build'
  | 'syllable-split'
  | 'blend-read'
  | 'structure-read'
  | 'structure-build'
  | 'structure-review'

export type SessionRating = 'independent' | 'with-help' | 'hard' | 'skip'
export type SessionModule = 'reading' | 'syllabification'
export type SyllabificationSupportMode =
  | 'full-help'
  | 'partial-help'
  | 'independent'

export interface RatingOption {
  value: SessionRating
  label: string
}

export interface GuidedReadingTaskContent {
  syllables: string[]
  word: string
  sentence: string
  question: string
}

export interface WordBuildingTile {
  id: string
  text: string
}

export interface WordBuildingTaskContent {
  targetWord: string
  syllables: string[]
  tiles: WordBuildingTile[]
}

export interface SyllabificationTaskContent {
  word: string
  syllables: string[]
  tiles: WordBuildingTile[]
  syllableCount: number
  supportMode: SyllabificationSupportMode
  revealedSplit?: string[]
}

export interface StructureTaskContent {
  structureId: StructureId
  difficultyStage: DifficultyStage
  materialKind: MaterialKind
  text: string
  syllables: string[]
  graphemes: GraphemeTuple[]
  supportMode: SyllabificationSupportMode
  blend?: {
    left: string
    right: string
    result: string
  }
  tiles?: WordBuildingTile[]
}

export interface SessionTask {
  id: string
  module: SessionModule
  kind: SessionTaskKind
  title: string
  prompt: string
  displayText: string
  supportText?: string
  materialId: SyllableId | WordId | SentenceId
  reviewText?: string
  difficultyOrder: number
  structureId?: StructureId
  difficultyStage?: DifficultyStage
  materialKind?: MaterialKind
  guidedReading?: GuidedReadingTaskContent
  wordBuilding?: WordBuildingTaskContent
  syllabification?: SyllabificationTaskContent
  structureExercise?: StructureTaskContent
}

export interface SessionAnswer {
  taskId: string
  rating: SessionRating
  points: number
}

interface BaseSession {
  id: string
  module: SessionModule
  tasks: SessionTask[]
  currentTaskIndex: number
  answers: SessionAnswer[]
  status: 'active' | 'completed'
}

export interface LevelReadingSession extends BaseSession {
  module: 'reading'
  levelId: ContentLevel['id']
}

export interface StructureSession extends BaseSession {
  module: 'syllabification'
  structureId: StructureId
  supportMode: SyllabificationSupportMode
  includePseudowords: boolean
  difficultyStage: DifficultyStage
}

export type ReadingSession = LevelReadingSession | StructureSession

export interface SessionSummary {
  totalTasks: number
  totalPoints: number
  counts: Record<SessionRating, number>
  pointsByRating: Record<SessionRating, number>
  difficultTasks: string[]
  skippedTasks: string[]
}
