import {
  getSessionSummary,
  ratingLabels,
  ratingOptions,
  type ReadingSession,
} from '../../session'
import { SummaryList } from './SummaryList'

interface SessionSummaryProps {
  session: ReadingSession
  onBack: () => void
  onReset: () => void
  onReturnHome: () => void
}

export function SessionSummary({
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
            <small>
              {summary.counts[option.value] * option.points} pkt
            </small>
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
