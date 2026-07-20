import type {
  ContentLevel,
  SentenceId,
  SyllableId,
  WordId,
} from '../content/contentTypes'

export type SessionTaskKind =
  | 'warmup'
  | 'guided-reading'
  | 'word-building'
  | 'sentence-comprehension'
  | 'syllable-count'
  | 'syllable-say'
  | 'syllable-build'
  | 'syllable-split'

export type SessionRating = 'independent' | 'with-help' | 'hard' | 'skip'
export type SessionModule = 'reading' | 'syllabification'
export type SyllabificationSupportMode =
  | 'full-help'
  | 'partial-help'
  | 'independent'

export interface RatingOption {
  value: SessionRating
  label: string
  points: number
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
  syllableCount: number
  supportMode: SyllabificationSupportMode
  revealedSplit?: string[]
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
  guidedReading?: GuidedReadingTaskContent
  wordBuilding?: WordBuildingTaskContent
  syllabification?: SyllabificationTaskContent
}

export interface SessionAnswer {
  taskId: string
  rating: SessionRating
  points: number
}

export interface ReadingSession {
  id: string
  module: SessionModule
  levelId: ContentLevel['id']
  tasks: SessionTask[]
  currentTaskIndex: number
  answers: SessionAnswer[]
  status: 'active' | 'completed'
}

export interface SessionSummary {
  totalTasks: number
  totalPoints: number
  counts: Record<SessionRating, number>
  difficultTasks: string[]
  skippedTasks: string[]
}
