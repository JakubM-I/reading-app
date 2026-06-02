import type { ContentLevel } from '../../content/contentTypes'
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
  onBack: () => void
  onRateTask: (rating: SessionRating) => void
  onReset: () => void
  onReturnHome: () => void
}

export function SessionScreen({
  level,
  session,
  onBack,
  onRateTask,
  onReset,
  onReturnHome,
}: SessionScreenProps) {
  if (session.status === 'completed') {
    return (
      <SessionSummary
        session={session}
        onBack={onBack}
        onReset={onReset}
        onReturnHome={onReturnHome}
      />
    )
  }

  const currentTask = getCurrentTask(session)
  const currentTaskNumber = session.answers.length + 1

  return (
    <section className="session-layout" aria-labelledby="session-title">
      <div className="session-area">
        <p className="eyebrow">Sesja</p>
        <h2 id="session-title">{level.name}</h2>
        <div className="progress-line" aria-label="Postęp sesji">
          <span>
            {currentTaskNumber} / {session.tasks.length}
          </span>
          <span>{currentTask?.title}</span>
        </div>

        {currentTask && <SessionTaskPanel task={currentTask} />}
      </div>

      <aside className="parent-panel session-panel" aria-label="Panel rodzica">
        <h2>Oceń wykonanie zadania</h2>
        <p className="panel-note">Po wyborze aplikacja przejdzie dalej.</p>
        <div className="rating-list">
          {ratingOptions.map((option) => (
            <button
              type="button"
              className="rating-button"
              key={option.value}
              onClick={() => onRateTask(option.value)}
            >
              <span>{option.label}</span>
              <span>{option.points} pkt</span>
            </button>
          ))}
        </div>

        <div className="quiet-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Zmień poziom
          </button>
          <button type="button" className="text-button" onClick={onReset}>
            Resetuj bieżącą sesję
          </button>
        </div>
      </aside>
    </section>
  )
}
