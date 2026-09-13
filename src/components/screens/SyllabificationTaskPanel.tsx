import { useState } from 'react'
import type { GraphemeTuple } from '../../content/contentTypes'
import type { SessionTask, WordBuildingTile } from '../../session'

interface SyllabificationTaskPanelProps {
  task: SessionTask
  taskCounterLabel: string
  onReadyForRating?: () => void
}

export function SyllabificationTaskPanel({
  task,
  taskCounterLabel,
  onReadyForRating,
}: SyllabificationTaskPanelProps) {
  const content = task.structureExercise
  const [isRevealed, setIsRevealed] = useState(false)
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([])
  const [message, setMessage] = useState('')

  if (!content) {
    return (
      <article className="task-panel">
        <p className="task-counter">{taskCounterLabel}</p>
        <p className="task-title">{task.prompt}</p>
        <p className="task-display">{task.displayText}</p>
      </article>
    )
  }

  const showStructure = task.kind === 'structure-build'
    ? isRevealed
    : content.supportMode === 'full-help' ||
      task.kind === 'structure-review' ||
      isRevealed
  const selectedTiles = selectedTileIds
    .map((id) => content.tiles?.find((tile) => tile.id === id))
    .filter((tile): tile is WordBuildingTile => Boolean(tile))
  const availableTiles =
    content.tiles?.filter((tile) => !selectedTileIds.includes(tile.id)) ?? []
  const correctBuildParts =
    task.kind === 'structure-build'
      ? content.structureId === 'structure-3'
        ? content.graphemes.map(([grapheme]) => grapheme)
        : content.syllables
      : []

  const checkBuild = () => {
    const answer = selectedTiles.map((tile) => tile.text).join('')

    if (answer !== content.text) {
      setMessage('Sprawdź kolejność części i spróbuj jeszcze raz.')
      return
    }

    setMessage('Dobrze ułożone. Przeczytaj całe słowo.')
    setIsRevealed(true)
    onReadyForRating?.()
  }

  return (
    <article className="task-panel structure-task" aria-label={task.title}>
      <p className="task-counter">{taskCounterLabel}</p>
      <p className="task-title">{task.prompt}</p>

      {content.materialKind === 'pseudoword' && (
        <p className="pseudoword-label">
          Wymyślone słowo — nie musi nic znaczyć.
        </p>
      )}

      {task.kind === 'blend-read' && content.blend ? (
        <div className="blend-workspace" aria-label="Łączenie części">
          <span className="blend-part">{content.blend.left}</span>
          <span className="blend-symbol" aria-hidden="true">+</span>
          <span className="blend-part">{content.blend.right}</span>
          <span className="blend-symbol" aria-hidden="true">→</span>
          {showStructure ? (
            <MarkedWord graphemes={content.graphemes} text={content.text} />
          ) : (
            <span className="blend-result-placeholder" aria-label="Miejsce na wynik">?</span>
          )}
        </div>
      ) : task.kind === 'structure-build' && content.tiles ? (
        <div className="structure-build-workspace">
          {content.supportMode !== 'independent' && !isRevealed && (
            <BuildHint
              parts={correctBuildParts}
              supportMode={content.supportMode}
            />
          )}
          <div className="word-answer" aria-label="Ułożone części">
            {content.tiles.map((_, index) => {
              const tile = selectedTiles[index]
              return tile ? (
                <button
                  type="button"
                  className="word-answer-tile"
                  key={tile.id}
                  onClick={() => {
                    setMessage('')
                    setSelectedTileIds((current) =>
                      current.filter((id) => id !== tile.id),
                    )
                  }}
                >
                  {tile.text}
                </button>
              ) : (
                <span className="word-answer-slot" key={`slot-${index}`} />
              )
            })}
          </div>
          <div className="word-tile-bank" aria-label="Części do ułożenia">
            {availableTiles.map((tile) => (
              <button
                type="button"
                className="word-tile"
                key={tile.id}
                onClick={() => {
                  setMessage('')
                  setSelectedTileIds((current) => [...current, tile.id])
                }}
              >
                {tile.text}
              </button>
            ))}
          </div>
          <div className="word-building-actions">
            <button
              type="button"
              className="secondary-button"
              disabled={selectedTileIds.length === 0}
              onClick={() => {
                setMessage('')
                setSelectedTileIds((current) => current.slice(0, -1))
              }}
            >
              Cofnij
            </button>
            <button
              type="button"
              className="primary-button compact"
              disabled={selectedTileIds.length !== content.tiles.length}
              onClick={checkBuild}
            >
              Sprawdź
            </button>
          </div>
        </div>
      ) : showStructure ? (
        <MarkedWord graphemes={content.graphemes} text={content.text} />
      ) : (
        <p className="task-display" lang="pl">{content.text}</p>
      )}

      {showStructure && task.kind !== 'structure-build' && (
        <StructureLegend />
      )}

      {!showStructure && task.kind !== 'structure-build' && (
        <button
          type="button"
          className="secondary-button compact reveal-structure-button"
          onClick={() => {
            setIsRevealed(true)
            onReadyForRating?.()
          }}
        >
          {content.supportMode === 'partial-help'
            ? 'Pokaż budowę'
            : 'Pokaż odpowiedź'}
        </button>
      )}

      {!showStructure && task.kind === 'structure-build' && (
        <button
          type="button"
          className="secondary-button compact reveal-structure-button"
          onClick={() => {
            setIsRevealed(true)
            setMessage('Przeczytaj odpowiedź i spróbuj ułożyć ją jeszcze raz.')
            onReadyForRating?.()
          }}
        >
          Pokaż odpowiedź
        </button>
      )}

      {showStructure && task.kind === 'structure-build' && (
        <section className="syllable-help-card" aria-label="Budowa słowa">
          <span className="syllable-help-label">Budowa słowa</span>
          <MarkedWord graphemes={content.graphemes} text={content.text} />
          <StructureLegend />
        </section>
      )}

      {message && <p className="word-building-message" role="status">{message}</p>}
    </article>
  )
}

interface BuildHintProps {
  parts: readonly string[]
  supportMode: 'full-help' | 'partial-help'
}

function BuildHint({ parts, supportMode }: BuildHintProps) {
  const visiblePartCount = supportMode === 'full-help' ? parts.length : 1

  return (
    <section className="build-hint" aria-label="Podpowiedź do układania">
      <span className="build-hint-label">
        {supportMode === 'full-help' ? 'Wzór kolejności' : 'Pierwsza część'}
      </span>
      <div className="build-hint-parts">
        {parts.map((part, index) => (
          <span
            className={index < visiblePartCount ? 'build-hint-part' : 'build-hint-slot'}
            key={`${part}-${index}`}
            aria-label={index < visiblePartCount ? part : 'puste miejsce'}
          >
            {index < visiblePartCount ? part : ''}
          </span>
        ))}
      </div>
    </section>
  )
}

interface MarkedWordProps {
  graphemes: readonly GraphemeTuple[]
  text: string
}

function MarkedWord({ graphemes, text }: MarkedWordProps) {
  const syllableIndexes = [...new Set(graphemes.map(([, , index]) => index))]

  return (
    <div className="marked-word" aria-label={`${text}, budowa słowa`} lang="pl">
      {syllableIndexes.map((syllableIndex, groupIndex) => (
        <span className="marked-syllable-group" key={syllableIndex}>
          {groupIndex > 0 && <span className="syllable-divider" aria-hidden="true">–</span>}
          <span className="marked-syllable">
            {graphemes
              .filter(([, , index]) => index === syllableIndex)
              .map(([grapheme, role], index) => (
                <span className={`grapheme ${role}`} key={`${grapheme}-${index}`}>
                  {grapheme}
                </span>
              ))}
          </span>
        </span>
      ))}
    </div>
  )
}

function StructureLegend() {
  return (
    <div className="structure-legend" aria-label="Legenda oznaczeń">
      <span><i className="legend-dot vowel" aria-hidden="true" />samogłoska</span>
      <span><i className="legend-dot consonant" aria-hidden="true" />spółgłoska</span>
      <span><i className="legend-divider" aria-hidden="true">–</i>granica sylaby</span>
    </div>
  )
}
