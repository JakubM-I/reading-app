import { useState } from 'react'
import type { ContentLevel } from '../../content/contentTypes'
import type { ProgressBadge } from '../../progress'
import {
  getCurrentTask,
  ratingOptions,
  type ReadingSession,
  type SessionRating,
} from '../../session'
import { SessionSummary } from './SessionSummary'
import { SessionTaskPanel } from './SessionTaskPanel'

interface SessionScreenProps {
  level: ContentLevel
  session: ReadingSession
  earnedBadges: ProgressBadge[]
  onBack: () => void
  onRateTask: (rating: SessionRating) => void
  onReset: () => void
  onReturnHome: () => void
}

export function SessionScreen({
  level,
  session,
  earnedBadges,
  onBack,
  onRateTask,
  onReset,
  onReturnHome,
}: SessionScreenProps) {
  const [ratingReadiness, setRatingReadiness] = useState<{
    sessionId: string
    readyTaskIds: Record<string, boolean>
  }>({
    sessionId: session.id,
    readyTaskIds: {},
  })

  if (session.status === 'completed') {
    return (
      <SessionSummary
        session={session}
        earnedBadges={earnedBadges}
        onBack={onBack}
        onReset={onReset}
        onReturnHome={onReturnHome}
      />
    )
  }

  const currentTask = getCurrentTask(session)
  const currentTaskNumber = session.answers.length + 1
  const roadSteps = Array.from({ length: session.tasks.length }, (_, index) => index + 1)
  const currentTaskKindLabel = currentTask?.title ?? 'Zadanie'
  const readyTaskIds =
    ratingReadiness.sessionId === session.id ? ratingReadiness.readyTaskIds : {}
  const canRateCurrentTask =
    !currentTask ||
    !taskNeedsCompletion(currentTask) ||
    readyTaskIds[currentTask.id] === true

  const markCurrentTaskReadyForRating = () => {
    if (!currentTask) {
      return
    }

    setRatingReadiness((currentReadiness) => {
      const currentReadyTaskIds =
        currentReadiness.sessionId === session.id
          ? currentReadiness.readyTaskIds
          : {}

      return {
        sessionId: session.id,
        readyTaskIds: {
          ...currentReadyTaskIds,
          [currentTask.id]: true,
        },
      }
    })
  }

  return (
    <section className="session-layout session-screen" aria-labelledby="session-title">
      <div className="session-area">
        <div className="session-topbar">
          <button type="button" className="secondary-button compact-action" onClick={onBack}>
            ← Powrót
          </button>
          <h2 id="session-title">
            Poziom {level.order} <span>·</span> {currentTaskKindLabel}
          </h2>
          <button
            type="button"
            className="secondary-button compact-action"
            onClick={onReturnHome}
          >
            Zakończ sesję
          </button>
        </div>

        <div className="reading-road" aria-label="Postęp sesji">
          <div className="road-track">
            {roadSteps.map((step) => (
              <span
                className={step <= currentTaskNumber ? 'road-step active' : 'road-step'}
                key={step}
                aria-current={step === currentTaskNumber ? 'step' : undefined}
              >
                {step}
              </span>
            ))}
            <span
              className="road-car"
              style={{
                left: `${5 + ((currentTaskNumber - 1) / Math.max(session.tasks.length - 1, 1)) * 90}%`,
              }}
              aria-hidden="true"
            />
          </div>
          <span className="finish-garage" aria-hidden="true">▣</span>
        </div>

        {currentTask && (
          <SessionTaskPanel
            task={currentTask}
            onReadyForRating={markCurrentTaskReadyForRating}
          />
        )}
      </div>

      <aside className="parent-panel session-panel" aria-label="Panel rodzica">
        <h2>Panel rodzica</h2>
        <p className="panel-note">Oceń wykonanie zadania</p>
        {canRateCurrentTask ? (
          <>
            <div className="rating-list">
              {ratingOptions.map((option) => (
                <button
                  type="button"
                  className="rating-button"
                  key={option.value}
                  onClick={() => onRateTask(option.value)}
                >
                  <span>
                    <span aria-hidden="true">{ratingIcons[option.value]}</span>
                    {option.label}
                  </span>
                  <span>{option.points} pkt</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="panel-note parent-waiting-note">
            {getWaitingNote(currentTask)}
          </p>
        )}

        <div className="quiet-actions">
          <button type="button" className="text-button" onClick={onReset}>
            Resetuj bieżącą sesję
          </button>
        </div>
      </aside>
    </section>
  )
}

const taskNeedsCompletion = (task: NonNullable<ReturnType<typeof getCurrentTask>>) =>
  (task.kind === 'guided-reading' && Boolean(task.guidedReading)) ||
  (task.kind === 'word-building' && Boolean(task.wordBuilding))

const ratingIcons: Record<SessionRating, string> = {
  independent: '★',
  'with-help': '●',
  hard: '▲',
  skip: '⌂',
}

const getWaitingNote = (task: ReturnType<typeof getCurrentTask>) => {
  if (task?.kind === 'word-building') {
    return 'Najpierw ułóż słowo z sylab.'
  }

  return 'Najpierw przejdź przez kroki czytania.'
}
