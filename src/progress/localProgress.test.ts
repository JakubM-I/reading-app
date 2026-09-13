import { describe, expect, it } from 'vitest'
import { exerciseContent } from '../content'
import { createSyllabificationSession, rateCurrentTask } from '../session'
import {
  createEmptyProgress,
  normalizeProgress,
  recordCompletedSession,
} from './localProgress'
import { parseProgressBackup } from './progressBackup'

describe('postępy w wersji 2', () => {
  it('migruje zapis wersji 1 i rozdziela klucze według rodzaju zadania', () => {
    const legacy = {
      version: 1,
      totalPoints: 7,
      sessions: [],
      badges: [],
      difficultItems: ['mama'],
      materialProgress: {
        'reading:word-l1-mama': {
          materialId: 'word-l1-mama',
          module: 'reading',
          kind: 'guided-reading',
          reviewText: 'mama',
          lastRating: 'with-help',
          lastPracticedAt: '2026-01-01T10:00:00.000Z',
          attempts: 2,
          hardCount: 0,
          skippedCount: 0,
        },
      },
    }

    const migrated = normalizeProgress(legacy)

    expect(migrated.version).toBe(2)
    expect(migrated.totalPoints).toBe(7)
    expect(migrated.difficultItems).toEqual(['mama'])
    expect(migrated.materialProgress['reading:guided-reading:word-l1-mama']).toBeDefined()
  })

  it('importuje kopię wersji 1', () => {
    const raw = JSON.stringify({
      app: 'reading-app',
      kind: 'progress-backup',
      exportedAt: '2026-01-01T10:00:00.000Z',
      progress: {
        version: 1,
        totalPoints: 3,
        sessions: [],
        badges: [],
        difficultItems: [],
        materialProgress: {},
      },
    })

    expect(parseProgressBackup(raw).progress.version).toBe(2)
    expect(parseProgressBackup(raw).progress.totalPoints).toBe(3)
  })

  it('zapisuje kontekst struktury oraz osobne rekordy umiejętności', () => {
    let session = createSyllabificationSession(
      'structure-3',
      'partial-help',
      true,
      exerciseContent,
    )

    for (let index = 0; index < session.tasks.length; index += 1) {
      session = rateCurrentTask(session, 'independent')
    }

    const progress = recordCompletedSession(createEmptyProgress(), session)
    const savedSession = progress.sessions[0]
    const repeatedMaterialId = session.tasks.find(
      (task) => task.kind === 'structure-build',
    )?.materialId

    expect(savedSession?.structureId).toBe('structure-3')
    expect(savedSession?.supportMode).toBe('partial-help')
    expect(savedSession?.includePseudowords).toBe(true)
    expect(
      progress.materialProgress[
        `syllabification:structure-build:${repeatedMaterialId}`
      ],
    ).toBeDefined()
    expect(
      Object.keys(progress.materialProgress).some(
        (key) => key.startsWith('syllabification:structure-read:'),
      ),
    ).toBe(true)
  })
})
