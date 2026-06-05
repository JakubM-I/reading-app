import { useState } from 'react'
import type { SessionTask } from '../../session'

interface GuidedReadingTaskPanelProps {
  task: SessionTask
  taskCounterLabel: string
  onReadyForRating?: () => void
}

const guidedStepLabels = ['Sylaby', 'Wyraz', 'Zdanie']

export function GuidedReadingTaskPanel({
  task,
  taskCounterLabel,
  onReadyForRating,
}: GuidedReadingTaskPanelProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isReadyForRating, setIsReadyForRating] = useState(false)
  const content = task.guidedReading

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

  const isSyllableStep = stepIndex === 0
  const isWordStep = stepIndex === 1
  const isSentenceStep = stepIndex === 2

  const moveForward = () => {
    if (!isSentenceStep) {
      setStepIndex((currentStep) => currentStep + 1)
      return
    }

    setIsReadyForRating(true)
    onReadyForRating?.()
  }

  return (
    <article className="task-panel guided-task" aria-label="Czytanie prowadzone">
      <p className="task-counter">{taskCounterLabel}</p>
      <ol className="guided-steps" aria-label="Kroki czytania">
        {guidedStepLabels.map((label, index) => (
          <li
            className={index === stepIndex ? 'active' : ''}
            key={label}
            aria-current={index === stepIndex ? 'step' : undefined}
          >
            {label}
          </li>
        ))}
      </ol>

      <p className="task-title">{getGuidedPrompt(stepIndex)}</p>

      {isSyllableStep && (
        <div className="guided-syllables" aria-label="Sylaby">
          {content.syllables.map((syllable, index) => (
            <span key={`${syllable}-${index}`}>{syllable}</span>
          ))}
        </div>
      )}

      {isWordStep && (
        <p className="guided-word" lang="pl">
          {content.word}
        </p>
      )}

      {isSentenceStep && (
        <div className="guided-sentence">
          <p lang="pl">{content.sentence}</p>
          <div className="guided-question">
            <span>Pytanie</span>
            <strong>{content.question}</strong>
          </div>
        </div>
      )}

      <button
        type="button"
        className={isSentenceStep ? 'primary-button compact' : 'secondary-button'}
        disabled={isReadyForRating}
        onClick={moveForward}
      >
        {getGuidedButtonLabel(stepIndex, isReadyForRating)}
      </button>
    </article>
  )
}

const getGuidedPrompt = (stepIndex: number) => {
  if (stepIndex === 0) {
    return 'Przeczytaj sylaby.'
  }

  if (stepIndex === 1) {
    return 'Przeczytaj cały wyraz.'
  }

  return 'Przeczytaj zdanie i odpowiedz.'
}

const getGuidedButtonLabel = (stepIndex: number, isReadyForRating: boolean) => {
  if (isReadyForRating) {
    return 'Gotowe do oceny'
  }

  if (stepIndex === 2) {
    return 'Przejdź do oceny'
  }

  return 'Dalej'
}
