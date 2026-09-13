import type { MaterialKind, StructureId } from '../content/contentTypes'
import type {
  SessionModule,
  SessionRating,
  SessionTaskKind,
  SyllabificationSupportMode,
} from '../session'

export interface ProgressBadge {
  id: string
  label: string
  pointsRequired: number
  earnedAt: string
}

export interface ProgressTaskRecord {
  taskId: string
  module: SessionModule
  kind: SessionTaskKind
  materialId: string
  reviewText: string
  rating: SessionRating
  points: number
  structureId?: StructureId
  materialKind?: MaterialKind
}

export interface ProgressSessionRecord {
  id: string
  completedAt: string
  module: SessionModule
  levelId?: string
  structureId?: StructureId
  supportMode?: SyllabificationSupportMode
  includePseudowords?: boolean
  totalTasks: number
  totalPoints: number
  counts: Record<SessionRating, number>
  difficultTasks: string[]
  skippedTasks: string[]
  tasks: ProgressTaskRecord[]
}

export interface MaterialProgressRecord {
  materialId: string
  module: SessionModule
  kind: SessionTaskKind
  reviewText: string
  lastRating: SessionRating
  lastPracticedAt: string
  attempts: number
  hardCount: number
  skippedCount: number
}

export interface StoredProgress {
  version: 2
  totalPoints: number
  sessions: ProgressSessionRecord[]
  badges: ProgressBadge[]
  difficultItems: string[]
  materialProgress: Record<string, MaterialProgressRecord>
}
