import { useState } from 'react'
import type { SessionTask, WordBuildingTile } from '../../session'

interface WordBuildingTaskPanelProps {
  task: SessionTask
  taskCounterLabel: string
  onReadyForRating?: () => void
}

export function WordBuildingTaskPanel({
  task,
  taskCounterLabel,
  onReadyForRating,
}: WordBuildingTaskPanelProps) {
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([])
  const [isReadyForRating, setIsReadyForRating] = useState(false)
  const [checkMessage, setCheckMessage] = useState('')
  const content = task.wordBuilding

  if (!content) {
    return (
      <article className="task-panel">
        <p className="task-counter">{taskCounterLabel}</p>
        <p className="task-title">{task.prompt}</p>
        <p className="task-display">{task.displayText}</p>
        {task.supportText && <p className="task-support">{task.supportText}</p>}
      </article>
    )
  }

  const tileById = new Map(content.tiles.map((tile) => [tile.id, tile]))
  const selectedTiles = selectedTileIds
    .map((tileId) => tileById.get(tileId))
    .filter((tile): tile is WordBuildingTile => Boolean(tile))
  const availableTiles = content.tiles.filter(
    (tile) => !selectedTileIds.includes(tile.id),
  )
  const isComplete = selectedTiles.length === content.tiles.length
  const isCorrect =
    isComplete &&
    selectedTiles.every((tile, index) => tile.text === content.syllables[index])

  const selectTile = (tileId: string) => {
    setCheckMessage('')
    setSelectedTileIds((currentTileIds) => [...currentTileIds, tileId])
  }

  const removeTile = (tileId: string) => {
    setCheckMessage('')
    setSelectedTileIds((currentTileIds) =>
      currentTileIds.filter((currentTileId) => currentTileId !== tileId),
    )
  }

  const undoLastTile = () => {
    setCheckMessage('')
    setSelectedTileIds((currentTileIds) => currentTileIds.slice(0, -1))
  }

  const checkWord = () => {
    if (!isCorrect) {
      setCheckMessage('Sprawdź kolejność sylab i spróbuj jeszcze raz.')
      return
    }

    setCheckMessage('')
    setIsReadyForRating(true)
    onReadyForRating?.()
  }

  return (
    <article className="task-panel word-building-task" aria-label="Budowanie słowa">
      <p className="task-counter">{taskCounterLabel}</p>
      <p className="task-title">{task.prompt}</p>

      <div className="word-building-target">
        <span>Słowo</span>
        <strong lang="pl">{content.targetWord}</strong>
      </div>

      <div className="word-answer" aria-label="Ułożone sylaby">
        {content.syllables.map((_, index) => {
          const tile = selectedTiles[index]

          if (!tile) {
            return <span className="word-answer-slot" key={`slot-${index}`} />
          }

          return (
            <button
              type="button"
              className="word-answer-tile"
              key={tile.id}
              disabled={isReadyForRating}
              onClick={() => removeTile(tile.id)}
            >
              {tile.text}
            </button>
          )
        })}
      </div>

      <div className="word-tile-bank" aria-label="Kafelki sylab">
        {availableTiles.map((tile) => (
          <button
            type="button"
            className="word-tile"
            key={tile.id}
            disabled={isReadyForRating}
            onClick={() => selectTile(tile.id)}
          >
            {tile.text}
          </button>
        ))}
      </div>

      {checkMessage && (
        <p className="word-building-message" role="status">
          {checkMessage}
        </p>
      )}

      <div className="word-building-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={selectedTiles.length === 0 || isReadyForRating}
          onClick={undoLastTile}
        >
          Cofnij
        </button>
        <button
          type="button"
          className="primary-button compact"
          disabled={!isComplete || isReadyForRating}
          onClick={checkWord}
        >
          {isReadyForRating ? 'Gotowe do oceny' : 'Sprawdź'}
        </button>
      </div>
    </article>
  )
}
