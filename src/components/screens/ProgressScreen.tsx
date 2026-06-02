import {
  getProgressOverview,
  type StoredProgress,
} from '../../progress'

interface ProgressScreenProps {
  progress: StoredProgress
  onBack: () => void
}

export function ProgressScreen({ progress, onBack }: ProgressScreenProps) {
  const overview = getProgressOverview(progress)
  const periods = [overview.today, overview.week, overview.month]

  return (
    <section className="screen-section" aria-labelledby="progress-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Postępy</p>
          <h2 id="progress-title">Panel postępów</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć
        </button>
      </div>

      <div className="progress-total-grid" aria-label="Podsumowanie łączne">
        <div>
          <h3>Punkty łączne</h3>
          <p>{overview.totalPoints}</p>
        </div>
        <div>
          <h3>Sesje łącznie</h3>
          <p>{overview.totalSessions}</p>
        </div>
        <div>
          <h3>Odznaki</h3>
          <p>{overview.badges.length}</p>
        </div>
      </div>

      <div className="period-grid" aria-label="Podsumowania okresów">
        {periods.map((period) => (
          <section className="period-panel" key={period.label}>
            <div className="period-heading">
              <h3>{period.label}</h3>
              <p>{period.rangeLabel}</p>
            </div>

            <dl className="period-stats">
              <div>
                <dt>Punkty</dt>
                <dd>{period.points}</dd>
              </div>
              <div>
                <dt>Sesje</dt>
                <dd>{period.sessions}</dd>
              </div>
              <div>
                <dt>Zadania</dt>
                <dd>{period.tasks}</dd>
              </div>
              <div>
                <dt>Samodzielnie</dt>
                <dd>{period.independent}</dd>
              </div>
              <div>
                <dt>Dni pracy</dt>
                <dd>{period.activeDays}</dd>
              </div>
              <div>
                <dt>Odznaki</dt>
                <dd>{period.badges.length}</dd>
              </div>
            </dl>

            <div className="period-lists">
              <div>
                <h4>Trudne słowa</h4>
                {period.difficultItems.length > 0 ? (
                  <ul>
                    {period.difficultItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Brak</p>
                )}
              </div>
              <div>
                <h4>Odznaki</h4>
                {period.badges.length > 0 ? (
                  <ul>
                    {period.badges.map((badge) => (
                      <li key={badge.id}>{badge.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Brak</p>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="progress-details">
        <section>
          <h3>Ostatnie trudne słowa</h3>
          {overview.recentDifficultItems.length > 0 ? (
            <ul>
              {overview.recentDifficultItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Brak</p>
          )}
        </section>

        <section>
          <h3>Wszystkie odznaki</h3>
          {overview.badges.length > 0 ? (
            <ul>
              {overview.badges.map((badge) => (
                <li key={badge.id}>{badge.label}</li>
              ))}
            </ul>
          ) : (
            <p>Brak</p>
          )}
        </section>

        <section>
          <h3>Kopia zapasowa</h3>
          <div className="quiet-actions">
            <button type="button" className="secondary-button" disabled>
              Eksportuj postępy
            </button>
            <button type="button" className="secondary-button" disabled>
              Importuj postępy
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
