import { useState } from 'react'
import type { SessionTask } from '../../session'

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
  const [selectedTileIndexes, setSelectedTileIndexes] = useState<number[]>([])
  const [splitIndexes, setSplitIndexes] = useState<number[]>([])
  const [selectedSyllableCount, setSelectedSyllableCount] = useState<number | null>(
    null,
  )
  const [isHintVisible, setIsHintVisible] = useState(false)
  const [isReadyForRating, setIsReadyForRating] = useState(false)
  const [checkMessage, setCheckMessage] = useState('')
  const content = task.syllabification

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

  const isIndependentMode = content.supportMode === 'independent'
  const usesIndependentCountCheck =
    task.kind === 'syllable-count' && isIndependentMode
  const usesIndependentSayCheck = task.kind === 'syllable-say' && isIndependentMode
  const isInteractive =
    usesIndependentCountCheck ||
    usesIndependentSayCheck ||
    task.kind === 'syllable-build' ||
    task.kind === 'syllable-split'
  const countOptions = getSyllableCountOptions(content.syllableCount)
  const availableTileIndexes = content.syllables
    .map((_, index) => index)
    .filter((index) => !selectedTileIndexes.includes(index))
  const selectedSyllables = selectedTileIndexes.map((index) => content.syllables[index])
  const expectedSplitIndexes = getExpectedSplitIndexes(content.syllables)
  const isSplitCorrect =
    splitIndexes.length === expectedSplitIndexes.length &&
    expectedSplitIndexes.every((index) => splitIndexes.includes(index))

  const markReadyForRating = () => {
    setCheckMessage('')
    setIsReadyForRating(true)
    onReadyForRating?.()
  }

  const checkBuild = () => {
    const isCorrect =
      selectedSyllables.length === content.syllables.length &&
      selectedSyllables.every((syllable, index) => syllable === content.syllables[index])

    if (!isCorrect) {
      setCheckMessage('Sprawdź kolejność sylab i spróbuj jeszcze raz.')
      return
    }

    markReadyForRating()
  }

  const checkCount = () => {
    if (selectedSyllableCount !== content.syllableCount) {
      setCheckMessage('Spróbuj jeszcze raz. Powiedz słowo powoli i policz części.')
      return
    }

    markReadyForRating()
  }

  const checkSplit = () => {
    if (!isSplitCorrect) {
      setCheckMessage('Sprawdź miejsca podziału i spróbuj jeszcze raz.')
      return
    }

    markReadyForRating()
  }

  const toggleSplitIndex = (index: number) => {
    setCheckMessage('')
    setSplitIndexes((currentIndexes) =>
      currentIndexes.includes(index)
        ? currentIndexes.filter((currentIndex) => currentIndex !== index)
        : [...currentIndexes, index].sort((first, second) => first - second),
    )
  }

  return (
    <article
      className="task-panel syllabification-task"
      aria-label="Sylabizowanie"
    >
      <p className="task-counter">{taskCounterLabel}</p>
      <p className="task-title">{task.prompt}</p>

      {task.kind === 'syllable-count' ? (
        usesIndependentCountCheck ? (
          <>
            <p className="task-display" lang="pl">
              {content.word}
            </p>
            <div className="syllable-count-options" aria-label="Liczba sylab">
              {countOptions.map((option) => (
                <button
                  type="button"
                  className={
                    selectedSyllableCount === option
                      ? 'syllable-count-button selected'
                      : 'syllable-count-button'
                  }
                  key={option}
                  disabled={isReadyForRating}
                  aria-pressed={selectedSyllableCount === option}
                  onClick={() => {
                    setCheckMessage('')
                    setSelectedSyllableCount(option)
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="task-display" lang="pl">
            {task.displayText}
          </p>
        )
      ) : task.kind === 'syllable-build' ? (
        <>
          <div className="word-answer" aria-label="Ułożone sylaby">
            {content.syllables.map((_, index) => {
              const syllable = selectedSyllables[index]

              if (!syllable) {
                return <span className="word-answer-slot" key={`slot-${index}`} />
              }

              return (
                <button
                  type="button"
                  className="word-answer-tile"
                  key={`${syllable}-${index}`}
                  disabled={isReadyForRating}
                  onClick={() =>
                    setSelectedTileIndexes((currentIndexes) =>
                      currentIndexes.filter((_, tileIndex) => tileIndex !== index),
                    )
                  }
                >
                  {syllable}
                </button>
              )
            })}
          </div>

          <div className="word-tile-bank" aria-label="Kafelki sylab">
            {availableTileIndexes.map((index) => (
              <button
                type="button"
                className="word-tile"
                key={`${content.syllables[index]}-${index}`}
                disabled={isReadyForRating}
                onClick={() =>
                  setSelectedTileIndexes((currentIndexes) => [...currentIndexes, index])
                }
              >
                {content.syllables[index]}
              </button>
            ))}
          </div>
        </>
      ) : task.kind === 'syllable-split' ? (
        <div className="split-word" aria-label="Miejsca podziału słowa">
          {content.word.split('').map((letter, index, letters) => (
            <span className="split-letter-group" key={`${letter}-${index}`}>
              <span className="split-letter">{letter}</span>
              {index < letters.length - 1 && (
                <button
                  type="button"
                  className={
                    splitIndexes.includes(index + 1)
                      ? 'split-marker selected'
                      : 'split-marker'
                  }
                  disabled={isReadyForRating}
                  aria-label={`Podział po literze ${letter}`}
                  onClick={() => toggleSplitIndex(index + 1)}
                >
                  |
                </button>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p className="task-display" lang="pl">
          {task.displayText}
        </p>
      )}

      {(content.revealedSplit || (isReadyForRating && isIndependentMode)) && (
        <div className="guided-syllables" aria-label="Podpowiedź sylab">
          {(content.revealedSplit ?? content.syllables).map((syllable, index) => (
            <span key={`${syllable || 'blank'}-${index}`}>
              {syllable || '...'}
            </span>
          ))}
        </div>
      )}

      {task.supportText && <p className="task-support">{task.supportText}</p>}

      {content.supportMode === 'independent' && (
        <button
          type="button"
          className="secondary-button compact"
          onClick={() => setIsHintVisible((currentValue) => !currentValue)}
        >
          Podpowiedź
        </button>
      )}

      {(isHintVisible || content.supportMode !== 'independent') && (
        <div className="guided-question syllabification-hint">
          <span>Ściąga</span>
          <strong>{getHintText(content.supportMode)}</strong>
        </div>
      )}

      {checkMessage && (
        <p className="word-building-message" role="status">
          {checkMessage}
        </p>
      )}

      {isInteractive && (
        <div className="word-building-actions">
          {!usesIndependentSayCheck && (
            <button
              type="button"
              className="secondary-button"
              disabled={
                isReadyForRating ||
                (usesIndependentCountCheck
                  ? selectedSyllableCount === null
                  : task.kind === 'syllable-build'
                    ? selectedTileIndexes.length === 0
                    : splitIndexes.length === 0)
              }
              onClick={() => {
                setCheckMessage('')
                if (usesIndependentCountCheck) {
                  setSelectedSyllableCount(null)
                  return
                }
                if (task.kind === 'syllable-build') {
                  setSelectedTileIndexes((currentIndexes) => currentIndexes.slice(0, -1))
                  return
                }
                setSplitIndexes([])
              }}
            >
              Cofnij
            </button>
          )}
          <button
            type="button"
            className="primary-button compact"
            disabled={
              isReadyForRating ||
              (usesIndependentCountCheck
                ? selectedSyllableCount === null
                : usesIndependentSayCheck
                  ? false
                  : task.kind === 'syllable-build'
                  ? selectedTileIndexes.length !== content.syllables.length
                  : splitIndexes.length === 0)
            }
            onClick={
              usesIndependentCountCheck
                ? checkCount
                : usesIndependentSayCheck
                  ? markReadyForRating
                  : task.kind === 'syllable-build'
                  ? checkBuild
                  : checkSplit
            }
          >
            {isReadyForRating ? 'Gotowe do oceny' : 'Sprawdź'}
          </button>
        </div>
      )}
    </article>
  )
}

const getSyllableCountOptions = (syllableCount: number) =>
  Array.from({ length: Math.max(4, syllableCount) }, (_, index) => index + 1)

const getExpectedSplitIndexes = (syllables: string[]) => {
  let nextIndex = 0

  return syllables.slice(0, -1).map((syllable) => {
    nextIndex += syllable.length
    return nextIndex
  })
}

const getHintText = (mode: string) => {
  if (mode === 'full-help') {
    return 'Czytaj części po kolei, potem całe słowo.'
  }

  if (mode === 'partial-help') {
    return 'Znajdź samogłoski i powiedz słowo powoli.'
  }

  return 'Powiedz słowo powoli. Dwuznak trzyma się razem.'
}
