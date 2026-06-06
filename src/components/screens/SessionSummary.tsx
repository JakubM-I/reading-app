import {
  getSessionSummary,
  ratingLabels,
  ratingOptions,
  type ReadingSession,
} from '../../session'
import type { ProgressBadge } from '../../progress'
import { SummaryList } from './SummaryList'

interface SessionSummaryProps {
  session: ReadingSession
  earnedBadges: ProgressBadge[]
  onBack: () => void
  onReset: () => void
  onReturnHome: () => void
}

export function SessionSummary({
  session,
  earnedBadges,
  onBack,
  onReset,
  onReturnHome,
}: SessionSummaryProps) {
  const summary = getSessionSummary(session)

  return (
    <section className="summary-screen" aria-labelledby="summary-title">
      <header className="summary-header">
        <h2 id="summary-title">Sesja zakończona</h2>
        <nav className="summary-nav" aria-label="Nawigacja podsumowania">
          <button type="button" className="secondary-button" onClick={onReturnHome}>
            Wróć do startu
          </button>
        </nav>
      </header>

      <div className="summary-workspace">
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

        {earnedBadges.length > 0 && (
          <section className="earned-badges" aria-label="Nowe odznaki">
            <h3>Nowa odznaka</h3>
            <ul>
              {earnedBadges.map((badge) => (
                <li key={badge.id}>{badge.label}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="primary-actions">
          <button type="button" className="primary-button" onClick={onReset}>
            Powtórz poziom
          </button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Wybierz inny poziom
          </button>
        </div>
      </div>
    </section>
  )
}
