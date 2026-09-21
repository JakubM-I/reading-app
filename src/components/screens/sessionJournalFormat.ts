import type { ProgressSessionRecord } from '../../progress'
import { exerciseContent } from '../../content'

export const formatSessionDate = (value: string) =>
  new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

export const formatSessionLabel = (session: ProgressSessionRecord) => {
  if (session.module === 'reading') {
    const levelNumber = session.levelId?.replace('level-', '')
    return `Czytanie · poziom ${levelNumber ?? '?'} · sesja ${session.scopeSessionNumber}`
  }

  const structure = exerciseContent.structures.find(
    (item) => item.id === session.structureId,
  )
  return `Sylabizowanie · struktura ${structure?.order ?? '?'} · sesja ${session.scopeSessionNumber} · ${formatSupportMode(session.supportMode)}`
}

const formatSupportMode = (mode: ProgressSessionRecord['supportMode']) => {
  if (mode === 'full-help') return 'Z pomocą'
  if (mode === 'partial-help') return 'Z podpowiedzią'
  return 'Samodzielnie'
}
