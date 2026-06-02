import type { SessionRating, SessionTaskKind } from '../session'

export interface ProgressBadge {
  id: string
  label: string
  pointsRequired: number
  earnedAt: string
}

export interface ProgressTaskRecord {
  taskId: string
  kind: SessionTaskKind
  materialId: string
  reviewText: string
  rating: SessionRating
  points: number
}

export interface ProgressSessionRecord {
  id: string
  completedAt: string
  levelId: string
  totalTasks: number
  totalPoints: number
  counts: Record<SessionRating, number>
  difficultTasks: string[]
  skippedTasks: string[]
  tasks: ProgressTaskRecord[]
}

export interface MaterialProgressRecord {
  materialId: string
  kind: SessionTaskKind
  reviewText: string
  lastRating: SessionRating
  lastPracticedAt: string
  attempts: number
  hardCount: number
  skippedCount: number
}

export interface StoredProgress {
  version: 1
  totalPoints: number
  sessions: ProgressSessionRecord[]
  badges: ProgressBadge[]
  difficultItems: string[]
  materialProgress: Record<string, MaterialProgressRecord>
}
