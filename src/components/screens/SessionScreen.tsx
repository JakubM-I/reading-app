import type { ContentLevel } from '../../content/contentTypes'
import {
  getCurrentTask,
  getSessionSummary,
  ratingLabels,
  ratingOptions,
  type ReadingSession,
  type SessionRating,
} from '../../session'

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

        {currentTask && (
          <article className="task-panel">
            <p className="task-title">{currentTask.prompt}</p>
            <p className="task-display">{currentTask.displayText}</p>
            {currentTask.supportText && (
              <p className="task-support">{currentTask.supportText}</p>
            )}
          </article>
        )}
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

interface SessionSummaryProps {
  session: ReadingSession
  onBack: () => void
  onReset: () => void
  onReturnHome: () => void
}

function SessionSummary({
  session,
  onBack,
  onReset,
  onReturnHome,
}: SessionSummaryProps) {
  const summary = getSessionSummary(session)

  return (
    <section className="screen-section" aria-labelledby="summary-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Podsumowanie</p>
          <h2 id="summary-title">Sesja zakończona</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onReturnHome}>
          Wróć do startu
        </button>
      </div>

      <dl className="summary-board">
        <div>
          <dt>Punkty</dt>
          <dd>{summary.totalPoints}</dd>
        </div>
        <div>
          <dt>Zadania</dt>
          <dd>{summary.totalTasks}</dd>
        </div>
      </dl>

      <div className="rating-summary" aria-label="Oceny w sesji">
        {ratingOptions.map((option) => (
          <div key={option.value}>
            <span>{ratingLabels[option.value]}</span>
            <strong>{summary.counts[option.value]}</strong>
          </div>
        ))}
      </div>

      <div className="session-notes">
        <SummaryList title="Trudne" items={summary.difficultTasks} emptyText="Brak" />
        <SummaryList title="Pominięte" items={summary.skippedTasks} emptyText="Brak" />
      </div>

      <div className="primary-actions">
        <button type="button" className="primary-button" onClick={onReset}>
          Powtórz poziom
        </button>
        <button type="button" className="secondary-button" onClick={onBack}>
          Wybierz inny poziom
        </button>
      </div>
    </section>
  )
}

interface SummaryListProps {
  title: string
  items: string[]
  emptyText: string
}

function SummaryList({ title, items, emptyText }: SummaryListProps) {
  return (
    <section>
      <h3>{title}</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  )
}
