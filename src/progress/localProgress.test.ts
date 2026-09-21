import { describe, expect, it } from 'vitest'
import { exerciseContent } from '../content'
import {
  createSyllabificationSession,
  rateCurrentTask,
  type ReadingSession,
} from '../session'
import {
  canRepeatSession,
  createEmptyProgress,
  normalizeProgress,
  recordCompletedSession,
  recordRepeatedSession,
} from './localProgress'
import { parseProgressBackup } from './progressBackup'

describe('postępy w wersji 3', () => {
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

    expect(migrated.version).toBe(3)
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

    expect(parseProgressBackup(raw).progress.version).toBe(3)
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
    expect(savedSession?.sessionTasks).toHaveLength(10)
    expect(savedSession?.attempts).toHaveLength(1)
  })

  it('zapisuje powtórkę w tej samej sesji i liczy tylko poprawę punktów', () => {
    let firstAttempt = createSyllabificationSession(
      'structure-1',
      'partial-help',
      true,
      exerciseContent,
    )

    for (let index = 0; index < firstAttempt.tasks.length; index += 1) {
      firstAttempt = rateCurrentTask(firstAttempt, 'with-help')
    }

    const initialProgress = recordCompletedSession(
      createEmptyProgress(),
      firstAttempt,
    )
    const replay: ReadingSession = {
      ...firstAttempt,
      currentTaskIndex: 0,
      answers: [],
      status: 'active',
    }
    let improvedAttempt = replay

    for (let index = 0; index < improvedAttempt.tasks.length; index += 1) {
      improvedAttempt = rateCurrentTask(improvedAttempt, 'independent')
    }

    const repeatedProgress = recordRepeatedSession(
      initialProgress,
      firstAttempt.id,
      improvedAttempt,
    )
    const savedSession = repeatedProgress.sessions[0]

    expect(repeatedProgress.sessions).toHaveLength(1)
    expect(savedSession.attempts).toHaveLength(2)
    expect(savedSession.totalPoints).toBe(improvedAttempt.answers.reduce((sum, answer) => sum + answer.points, 0))
    expect(repeatedProgress.totalPoints).toBe(savedSession.totalPoints)
    expect(savedSession.tasks[0].rating).toBe('independent')
    const firstTask = savedSession.tasks[0]
    expect(
      repeatedProgress.materialProgress[
        `${firstTask.module}:${firstTask.kind}:${firstTask.materialId}`
      ].attempts,
    ).toBe(2)
  })

  it('nie obniża najlepszego wyniku i nie pozwala powtarzać pełnej sesji', () => {
    let session = createSyllabificationSession(
      'structure-2',
      'partial-help',
      true,
      exerciseContent,
    )

    for (let index = 0; index < session.tasks.length; index += 1) {
      session = rateCurrentTask(session, 'independent')
    }

    const progress = recordCompletedSession(createEmptyProgress(), session)
    const weakerAttempt: ReadingSession = {
      ...session,
      currentTaskIndex: session.tasks.length,
      answers: session.answers.map((answer) => ({ ...answer, rating: 'skip', points: 0 })),
      status: 'completed',
    }
    const repeated = recordRepeatedSession(progress, session.id, weakerAttempt)

    expect(repeated.totalPoints).toBe(progress.totalPoints)
    expect(repeated.sessions[0].totalPoints).toBe(progress.sessions[0].totalPoints)
    expect(canRepeatSession(repeated.sessions[0])).toBe(false)
  })

  it('zachowuje starszą sesję do podglądu bez migawki zadań', () => {
    const migrated = normalizeProgress({
      version: 2,
      totalPoints: 4,
      sessions: [{
        id: 'old-session',
        completedAt: '2026-01-01T10:00:00.000Z',
        module: 'reading',
        levelId: 'level-1',
        totalTasks: 1,
        totalPoints: 4,
        counts: { independent: 1, 'with-help': 0, hard: 0, skip: 0 },
        difficultTasks: [],
        skippedTasks: [],
        tasks: [{
          taskId: 'old-task',
          module: 'reading',
          kind: 'warmup',
          materialId: 'syllable-a',
          reviewText: 'a',
          rating: 'independent',
          points: 4,
        }],
      }],
      badges: [],
      difficultItems: [],
      materialProgress: {},
    })

    expect(migrated.sessions[0].attempts).toHaveLength(1)
    expect(migrated.sessions[0].sessionTasks).toBeUndefined()
    expect(canRepeatSession(migrated.sessions[0])).toBe(false)
  })
})
