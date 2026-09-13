import { describe, expect, it } from 'vitest'
import { exerciseContent } from '../content'
import type { StructureId } from '../content/contentTypes'
import type { MaterialProgressRecord } from '../progress'
import {
  createSyllabificationSession,
  getActiveDifficultyStage,
} from './createSyllabificationSession'
import { getTaskRatingPoints } from './sessionScoring'
import type { SyllabificationSupportMode } from './sessionTypes'

const structureIds: StructureId[] = [
  'structure-1',
  'structure-2',
  'structure-3',
  'structure-4',
  'structure-5',
  'structure-6',
]
const supportModes: SyllabificationSupportMode[] = [
  'full-help',
  'partial-help',
  'independent',
]

describe('createSyllabificationSession', () => {
  for (const structureId of structureIds) {
    for (const supportMode of supportModes) {
      for (const includePseudowords of [true, false]) {
        it(`${structureId}, ${supportMode}, pseudowyrazy: ${includePseudowords}`, () => {
          const session = createSyllabificationSession(
            structureId,
            supportMode,
            includePseudowords,
            exerciseContent,
          )

          expect(session.module).toBe('syllabification')
          expect(session.tasks).toHaveLength(10)
          expect(session.tasks.every((task) => task.structureId === structureId)).toBe(true)
          expect(session.tasks.filter((task) => task.kind === 'blend-read')).toHaveLength(3)
          expect(session.tasks.filter((task) => task.kind === 'structure-read')).toHaveLength(5)
          expect(session.tasks.filter((task) => task.kind === 'structure-build')).toHaveLength(1)
          expect(session.tasks.filter((task) => task.kind === 'structure-review')).toHaveLength(1)
          expect(
            session.tasks.filter((task) => task.materialKind === 'pseudoword'),
          ).toHaveLength(includePseudowords ? 2 : 0)
          expect(session.tasks.some((task) => task.displayText === 'Brak zadania')).toBe(false)
        })
      }
    }
  }

  it('obsługuje CVC bez sztucznego podziału sylabowego', () => {
    const session = createSyllabificationSession(
      'structure-3',
      'independent',
      true,
      exerciseContent,
    )
    const words = session.tasks.filter(
      (task) => task.kind === 'structure-read' && task.materialKind === 'word',
    )
    const build = session.tasks.find((task) => task.kind === 'structure-build')

    expect(words.every((task) => task.structureExercise?.syllables.length === 1)).toBe(true)
    expect(build?.structureExercise?.tiles).toHaveLength(3)
  })

  it('uwzględnia tryb pomocy w punktacji nowych zadań', () => {
    const withHelp = createSyllabificationSession(
      'structure-1',
      'full-help',
      true,
      exerciseContent,
    ).tasks[0]
    const independent = createSyllabificationSession(
      'structure-1',
      'independent',
      true,
      exerciseContent,
    ).tasks[0]

    expect(getTaskRatingPoints(withHelp, 'independent')).toBe(1)
    expect(getTaskRatingPoints(independent, 'independent')).toBe(2)
  })

  it('wprowadza kolejny stopień dopiero po pokazaniu wszystkich słów', () => {
    const progress: Record<string, MaterialProgressRecord> = {}
    const basicWords = exerciseContent.decodingWords.filter(
      (item) =>
        item.structureId === 'structure-1' && item.difficultyStage === 'basic',
    )

    for (const word of basicWords) {
      progress[`syllabification:structure-read:${word.id}`] = recordFor(
        word.id,
        'structure-read',
      )
    }

    expect(
      getActiveDifficultyStage('structure-1', exerciseContent.decodingWords, progress),
    ).toBe('extended')

    for (const word of exerciseContent.decodingWords.filter(
      (item) =>
        item.structureId === 'structure-1' && item.difficultyStage === 'extended',
    )) {
      progress[`syllabification:structure-read:${word.id}`] = recordFor(
        word.id,
        'structure-read',
      )
    }

    expect(
      getActiveDifficultyStage('structure-1', exerciseContent.decodingWords, progress),
    ).toBe('digraph')
  })

  it('priorytetyzuje trudne słowo tylko w historii czytania struktury', () => {
    const hardWord = exerciseContent.decodingWords.find(
      (item) =>
        item.structureId === 'structure-1' && item.difficultyStage === 'basic',
    )!
    const progress = {
      [`syllabification:structure-read:${hardWord.id}`]: {
        ...recordFor(hardWord.id, 'structure-read'),
        lastRating: 'hard' as const,
        hardCount: 2,
      },
      [`syllabification:structure-build:${hardWord.id}`]: recordFor(
        hardWord.id,
        'structure-build',
      ),
    }
    const session = createSyllabificationSession(
      'structure-1',
      'full-help',
      true,
      exerciseContent,
      { materialProgress: progress },
    )

    expect(
      session.tasks.some(
        (task) => task.kind === 'structure-read' && task.materialId === hardWord.id,
      ),
    ).toBe(true)
  })

  it('priorytetyzuje ocenę „Z pomocą” osobno dla rodzaju zadania', () => {
    const baseline = createSyllabificationSession(
      'structure-1',
      'full-help',
      true,
      exerciseContent,
    )
    const baselineReadIds = new Set(
      baseline.tasks
        .filter(
          (task) =>
            task.kind === 'structure-read' && task.materialKind === 'word',
        )
        .map((task) => task.materialId),
    )
    const target = exerciseContent.decodingWords.find(
      (item) =>
        item.structureId === 'structure-1' &&
        item.difficultyStage === 'basic' &&
        !baselineReadIds.has(item.id),
    )!
    const buildOnlyProgress = {
      [`syllabification:structure-build:${target.id}`]: {
        ...recordFor(target.id, 'structure-build'),
        lastRating: 'with-help' as const,
      },
    }
    const afterBuildRating = createSyllabificationSession(
      'structure-1',
      'full-help',
      true,
      exerciseContent,
      { materialProgress: buildOnlyProgress },
    )

    expect(
      afterBuildRating.tasks.some(
        (task) => task.kind === 'structure-read' && task.materialId === target.id,
      ),
    ).toBe(false)

    const afterReadRating = createSyllabificationSession(
      'structure-1',
      'full-help',
      true,
      exerciseContent,
      {
        materialProgress: {
          ...buildOnlyProgress,
          [`syllabification:structure-read:${target.id}`]: {
            ...recordFor(target.id, 'structure-read'),
            lastRating: 'with-help',
          },
        },
      },
    )

    expect(
      afterReadRating.tasks.some(
        (task) => task.kind === 'structure-read' && task.materialId === target.id,
      ),
    ).toBe(true)
  })
})

const recordFor = (
  materialId: string,
  kind: MaterialProgressRecord['kind'],
): MaterialProgressRecord => ({
  materialId,
  module: 'syllabification',
  kind,
  reviewText: materialId,
  lastRating: 'independent',
  lastPracticedAt: '2026-01-01T10:00:00.000Z',
  attempts: 1,
  hardCount: 0,
  skippedCount: 0,
})
