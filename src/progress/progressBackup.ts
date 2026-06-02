import type { StoredProgress } from './progressTypes'

interface ProgressBackupFile {
  app: 'reading-app'
  kind: 'progress-backup'
  exportedAt: string
  progress: StoredProgress
}

export interface ParsedProgressBackup {
  progress: StoredProgress
  exportedAt?: string
}

export const createProgressBackup = (progress: StoredProgress): string => {
  const backup: ProgressBackupFile = {
    app: 'reading-app',
    kind: 'progress-backup',
    exportedAt: new Date().toISOString(),
    progress,
  }

  return JSON.stringify(backup, null, 2)
}

export const createProgressBackupFilename = (date = new Date()) => {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

  return `postepy-czytanie-${datePart}.json`
}

export const parseProgressBackup = (rawValue: string): ParsedProgressBackup => {
  const parsedValue: unknown = JSON.parse(rawValue)

  if (isProgressBackupFile(parsedValue)) {
    return {
      progress: parsedValue.progress,
      exportedAt: parsedValue.exportedAt,
    }
  }

  if (isStoredProgress(parsedValue)) {
    return { progress: parsedValue }
  }

  throw new Error('Nieprawidłowy plik postępów.')
}

const isProgressBackupFile = (value: unknown): value is ProgressBackupFile => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const backup = value as Partial<ProgressBackupFile>

  return (
    backup.app === 'reading-app' &&
    backup.kind === 'progress-backup' &&
    typeof backup.exportedAt === 'string' &&
    isStoredProgress(backup.progress)
  )
}

const isStoredProgress = (value: unknown): value is StoredProgress => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const progress = value as Partial<StoredProgress>

  return (
    progress.version === 1 &&
    typeof progress.totalPoints === 'number' &&
    Array.isArray(progress.sessions) &&
    Array.isArray(progress.badges) &&
    Array.isArray(progress.difficultItems) &&
    Boolean(progress.materialProgress) &&
    typeof progress.materialProgress === 'object'
  )
}
