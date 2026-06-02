import type { StoredProgress } from '../../progress'

interface ProgressScreenProps {
  progress: StoredProgress
  onBack: () => void
}

export function ProgressScreen({ progress, onBack }: ProgressScreenProps) {
  const lastSession = progress.sessions.at(-1)
  const recentDifficultItems = progress.difficultItems.slice(0, 5)

  return (
    <section className="screen-section" aria-labelledby="progress-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Postępy</p>
          <h2 id="progress-title">Lokalny zapis</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onBack}>
          Wróć
        </button>
      </div>

      <div className="placeholder-grid">
        <div>
          <h3>Punkty łączne</h3>
          <p>{progress.totalPoints}</p>
        </div>
        <div>
          <h3>Sesje</h3>
          <p>{progress.sessions.length}</p>
        </div>
        <div>
          <h3>Odznaki</h3>
          <p>{progress.badges.length}</p>
        </div>
      </div>

      <div className="progress-details">
        <section>
          <h3>Ostatnia sesja</h3>
          {lastSession ? (
            <p>
              {lastSession.totalPoints} pkt, {lastSession.totalTasks} zadań
            </p>
          ) : (
            <p>Brak zapisanych sesji.</p>
          )}
        </section>

        <section>
          <h3>Trudne słowa</h3>
          {recentDifficultItems.length > 0 ? (
            <ul>
              {recentDifficultItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>Brak trudnych słów.</p>
          )}
        </section>

        <section>
          <h3>Odznaki</h3>
          {progress.badges.length > 0 ? (
            <ul>
              {progress.badges.map((badge) => (
                <li key={badge.id}>{badge.label}</li>
              ))}
            </ul>
          ) : (
            <p>Odznaki pojawią się po zdobyciu punktów.</p>
          )}
        </section>
      </div>

      <p className="calm-note">
        Pełne podsumowania dnia, tygodnia i miesiąca pojawią się w kolejnym etapie.
      </p>
    </section>
  )
}
