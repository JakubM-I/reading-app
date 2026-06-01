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

export type SessionRating = 'independent' | 'with-help' | 'hard' | 'skip'

export interface RatingOption {
  value: SessionRating
  label: string
  points: number
}

export interface SessionTask {
  id: string
  kind: SessionTaskKind
  title: string
  prompt: string
  displayText: string
  supportText?: string
  materialId: SyllableId | WordId | SentenceId
  reviewText?: string
}

export interface SessionAnswer {
  taskId: string
  rating: SessionRating
  points: number
}

export interface ReadingSession {
  id: string
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
