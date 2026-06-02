import { useState } from 'react'
import type { SessionTask, WordBuildingTile } from '../../session'

interface WordBuildingTaskPanelProps {
  task: SessionTask
  onReadyForRating?: () => void
}

export function WordBuildingTaskPanel({
  task,
  onReadyForRating,
}: WordBuildingTaskPanelProps) {
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([])
  const [isReadyForRating, setIsReadyForRating] = useState(false)
  const content = task.wordBuilding

  if (!content) {
    return (
      <article className="task-panel">
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

  const selectTile = (tileId: string) => {
    setSelectedTileIds((currentTileIds) => [...currentTileIds, tileId])
  }

  const removeTile = (tileId: string) => {
    setSelectedTileIds((currentTileIds) =>
      currentTileIds.filter((currentTileId) => currentTileId !== tileId),
    )
  }

  const undoLastTile = () => {
    setSelectedTileIds((currentTileIds) => currentTileIds.slice(0, -1))
  }

  const markReadyForRating = () => {
    setIsReadyForRating(true)
    onReadyForRating?.()
  }

  return (
    <article className="task-panel word-building-task" aria-label="Budowanie słowa">
      <p className="task-title">{task.prompt}</p>

      <div className="word-building-target">
        <span>Słowo</span>
        <strong lang="pl">{content.targetWord}</strong>
      </div>

      <div className="word-answer" aria-label="Ułożone sylaby">
        {selectedTiles.length > 0 ? (
          selectedTiles.map((tile) => (
            <button
              type="button"
              className="word-answer-tile"
              key={tile.id}
              disabled={isReadyForRating}
              onClick={() => removeTile(tile.id)}
            >
              {tile.text}
            </button>
          ))
        ) : (
          <span>Tu układasz słowo</span>
        )}
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
          onClick={markReadyForRating}
        >
          {isReadyForRating ? 'Gotowe do oceny' : 'Przejdź do oceny'}
        </button>
      </div>
    </article>
  )
}
