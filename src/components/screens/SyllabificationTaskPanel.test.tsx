import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { exerciseContent } from '../../content'
import { createSyllabificationSession } from '../../session'
import { SyllabificationTaskPanel } from './SyllabificationTaskPanel'

const renderBuildTask = (
  supportMode: 'full-help' | 'partial-help' | 'independent',
) => {
  const task = createSyllabificationSession(
    'structure-4',
    supportMode,
    true,
    exerciseContent,
  ).tasks.find((item) => item.kind === 'structure-build')!

  return {
    markup: renderToStaticMarkup(
      <SyllabificationTaskPanel task={task} taskCounterLabel="Zadanie 9 z 10" />,
    ),
    parts: task.structureExercise!.syllables,
  }
}

describe('podpowiedź w zadaniu układania', () => {
  it('pokazuje cały wzór w trybie pełnej pomocy', () => {
    const { markup, parts } = renderBuildTask('full-help')

    expect(markup).toContain('Wzór kolejności')
    for (const part of parts) {
      expect(markup).toContain(`>${part}</span>`)
    }
    expect(markup).not.toContain('aria-label="puste miejsce"')
  })

  it('pokazuje pierwszą część i puste miejsca w trybie podpowiedzi', () => {
    const { markup, parts } = renderBuildTask('partial-help')

    expect(markup).toContain('Pierwsza część')
    expect(markup).toContain(`>${parts[0]}</span>`)
    expect(markup).not.toContain(`>${parts[1]}</span>`)
    expect(markup).toContain('aria-label="puste miejsce"')
  })

  it('nie pokazuje wzoru w trybie samodzielnym', () => {
    const { markup } = renderBuildTask('independent')

    expect(markup).not.toContain('Podpowiedź do układania')
    expect(markup).not.toContain('Wzór kolejności')
    expect(markup).not.toContain('Pierwsza część')
  })
})

describe('podpowiedź w zadaniu czytania słowa', () => {
  it('pokazuje pierwszą sylabę w trybie podpowiedzi', () => {
    const task = createSyllabificationSession(
      'structure-4',
      'partial-help',
      true,
      exerciseContent,
    ).tasks.find(
      (item) => item.kind === 'structure-read' && item.materialKind === 'word',
    )!
    const content = task.structureExercise!
    const markup = renderToStaticMarkup(
      <SyllabificationTaskPanel task={task} taskCounterLabel="Zadanie 4 z 10" />,
    )

    expect(markup).toContain('Zacznij od')
    expect(markup).toContain(
      `aria-label="${content.syllables[0]}, budowa słowa"`,
    )
    expect(markup).toContain(`>${content.text}</p>`)
    expect(markup.indexOf(`>${content.text}</p>`)).toBeLessThan(
      markup.indexOf('Zacznij od'),
    )
  })

  it('dla CVC pokazuje początkowe połączenie C + V', () => {
    const task = createSyllabificationSession(
      'structure-3',
      'partial-help',
      true,
      exerciseContent,
    ).tasks.find(
      (item) => item.kind === 'structure-read' && item.materialKind === 'word',
    )!
    const content = task.structureExercise!
    const initialCv = content.graphemes
      .slice(0, 2)
      .map(([grapheme]) => grapheme)
      .join('')
    const markup = renderToStaticMarkup(
      <SyllabificationTaskPanel task={task} taskCounterLabel="Zadanie 4 z 10" />,
    )

    expect(markup).toContain(`aria-label="${initialCv}, budowa słowa"`)
  })

  it.each(['full-help', 'independent'] as const)(
    'nie pokazuje częściowej wskazówki w trybie %s',
    (supportMode) => {
      const task = createSyllabificationSession(
        'structure-4',
        supportMode,
        true,
        exerciseContent,
      ).tasks.find(
        (item) => item.kind === 'structure-read' && item.materialKind === 'word',
      )!
      const markup = renderToStaticMarkup(
        <SyllabificationTaskPanel task={task} taskCounterLabel="Zadanie 4 z 10" />,
      )

      expect(markup).not.toContain('Zacznij od')
      expect(markup).not.toContain('Podpowiedź do czytania')
    },
  )
})
